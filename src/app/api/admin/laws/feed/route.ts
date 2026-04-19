import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import axios from 'axios';
import { parseString } from 'xml2js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - Fetch new laws from JORADP and return them for review
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session?.user?.email?.includes('@admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'إداري'; // Default to Administrative Law
    const limit = parseInt(searchParams.get('limit') || '10');
    const daysBack = parseInt(searchParams.get('daysBack') || '30');

    // Fetch recent laws from JORADP
    const newLaws = await fetchRecentJoradpLaws(category, daysBack, limit);
    
    // Check which ones already exist in our database
    const existingReferenceNumbers = await prisma.law.findMany({
      select: { referenceNumber: true },
    });
    
    const existingRefs = new Set(existingReferenceNumbers.map(l => l.referenceNumber));
    
    // Filter out laws we already have
    const trulyNewLaws = newLaws.filter(law => 
      !existingRefs.has(law.referenceNumber)
    );

    return NextResponse.json({ 
      laws: trulyNewLaws,
      count: trulyNewLaws.length,
      message: `Found ${trulyNewLaws.length} new ${category} laws from JORADP`
    });
  } catch (error) {
    console.error('Error fetching JORADP feed:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch JORADP feed', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// POST - Add selected laws from the feed to the database
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email?.includes('@admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { laws } = await request.json();
    
    if (!Array.isArray(laws) || laws.length === 0) {
      return NextResponse.json({ error: 'No laws provided' }, { status: 400 });
    }

    const addedLaws = [];
    const errors = [];

    for (const lawData of laws) {
      try {
        // Validate required fields
        if (!lawData.titleAr || !lawData.titleFr || !lawData.referenceNumber) {
          errors.push({ law: lawData.titleAr, error: 'Missing required fields' });
          continue;
        }

        // Check if law already exists
        const existing = await prisma.law.findUnique({
          where: { referenceNumber: lawData.referenceNumber },
        });

        if (existing) {
          errors.push({ law: lawData.titleAr, error: 'Law already exists' });
          continue;
        }

        // Create the law
        const law = await prisma.law.create({
          data: {
            titleAr: lawData.titleAr,
            titleFr: lawData.titleFr,
            titleEn: lawData.titleEn || lawData.titleFr,
            category: lawData.category || 'إداري',
            lawType: lawData.lawType || 'مرسوم تنفيذي',
            referenceNumber: lawData.referenceNumber,
            year: lawData.year || new Date().getFullYear(),
            publicationDate: lawData.publicationDate || `${new Date().getFullYear()}-01-01`,
            journalOfficiel: lawData.journalOfficiel || `JORF ${new Date().getFullYear()}/000`,
            descriptionAr: lawData.descriptionAr || lawData.titleAr,
            descriptionFr: lawData.descriptionFr || lawData.titleFr,
            descriptionEn: lawData.descriptionEn || lawData.titleFr,
            contentAr: lawData.contentAr || lawData.titleAr,
            contentFr: lawData.contentFr || lawData.titleFr,
            contentEn: lawData.contentEn || lawData.titleFr,
            source: 'joradp.dz',
            sourceUrl: lawData.sourceUrl || `https://www.joradp.dz`,
            isVerified: false, // Needs review
            isPremium: false,
          }
        });

        addedLaws.push(law);
      } catch (error) {
        errors.push({ 
          law: lawData.titleAr || 'Unknown', 
          error: error instanceof Error ? error.message : String(error) 
        });
      }
    }

    return NextResponse.json({ 
      added: addedLaws.length,
      errors: errors.length,
      laws: addedLaws,
      errorDetails: errors
    });
  } catch (error) {
    console.error('Error adding laws from feed:', error);
    return NextResponse.json({ 
      error: 'Failed to add laws', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Helper function to fetch recent laws from JORADP
async function fetchRecentJoradpLaws(category: string, daysBack: number, limit: number) {
  try {
    // In a real implementation, we would fetch from JORADP's API or RSS feed
    // For now, we'll simulate with some sample data that matches the expected format
    // In production, this would parse actual JORADP data
    
    // Simulate fetching from JORADP - replace with actual implementation
    const simulatedResponse = await simulateJoradpFetch(category, daysBack, limit);
    return simulatedResponse;
  } catch (error) {
    console.warn('Failed to fetch from JORADP, using fallback data:', error);
    return getFallbackLaws(category, limit);
  }
}

// Simulate JORADP fetch (replace with actual implementation)
async function simulateJoradpFetch(category: string, daysBack: number, limit: number): Promise<Array<any>> {
  // This is a placeholder - in reality, you would:
  // 1. Fetch from JORADP's website or API
  // 2. Parse the HTML/XML/JSON response
  // 3. Extract law details
  
  // For demo purposes, we'll return some sample administrative laws
  const sampleLaws = [
    {
      titleAr: 'المرسوم التنفيذي المتضمن تعديل وإتمام المرسوم التنفيذي رقم 21-266 المؤرخ في 14 جويلية 2021',
      titleFr: 'Décret exécutif modifiant et complétant le décret exécutif n° 21-266 du 14 juillet 2021',
      referenceNumber: '24-123',
      category: 'إداري',
      lawType: 'مرسوم تنفيذي',
      year: 2024,
      jorfYear: 2024,
      jorfNumber: 123,
      publicationDate: '2024-03-15',
      journalOfficiel: 'JORF 123/2024',
      descriptionAr: 'مرسوم تنفيذي يخص التوظيف في القطاع العمومي',
      descriptionFr: 'Décret exécutif relatif au recrutement dans la fonction publique',
      contentAr: 'محتوى المرسوم التنفيذي المتعلق بقواعد التوظيف والترقي في الإدارات العمومية...',
      contentFr: 'Contenu du décret exécutif relatif aux règles de recrutement et d\'avancement dans les administrations publiques...',
      sourceUrl: 'https://www.joradp.dz/FTP/jo-arabe/2024/A2024123.pdf',
    },
    {
      titleAr: 'المرسوم التنفيذي المتعلق بتنظيم عمل اللجان المتساوية الفرص بين الجنسين',
      titleFr: 'Décret exécutif relatif à l\'organisation des comités pour l\'égalité des chances entre hommes et femmes',
      referenceNumber: '24-456',
      category: 'إداري',
      lawType: 'مرسوم تنفيذي',
      year: 2024,
      jorfYear: 2024,
      jorfNumber: 456,
      publicationDate: '2024-02-28',
      journalOfficiel: 'JORF 456/2024',
      descriptionAr: 'مرسوم تنفيذي يهدف إلى تعزيز المساواة بين الجنسين في مكان العمل',
      descriptionFr: 'Décret exécutif visant à promouvoir l\'égalité entre hommes et femmes sur le lieu de travail',
      contentAr: 'محتوى المرسوم التنفيذي المتعلق بتشكيل وعمل اللجان المتساوية الفرص بين الجنسين في المؤسسات العمومية...',
      contentFr: 'Contenu du décret exécutif relatif à la composition et au fonctionnement des comités pour l\'égalité des chances...',
      sourceUrl: 'https://www.joradp.dz/FTP/jo-arabe/2024/A2024456.pdf',
    },
    {
      titleAr: 'المرسوم التنفيذي المتضمن تعديل المرسوم التنفيذي رقم 20-302 المؤرخ في 15 نوفمبر 2020',
      titleFr: 'Décret exécutif modifiant le décret exécutif n° 20-302 du 15 novembre 2020',
      referenceNumber: '24-789',
      category: 'إداري',
      lawType: 'مرسوم تنفيذي',
      year: 2024,
      jorfYear: 2024,
      jorfNumber: 789,
      publicationDate: '2024-01-30',
      journalOfficiel: 'JORF 789/2024',
      descriptionAr: 'مرسوم تنفيذي يخص الإجراءات التأديبية في القطاع العمومي',
      descriptionFr: 'Décret exécutif relatif aux procédures disciplinaires dans la fonction publique',
      contentAr: 'محتوى المرسوم التنفيذي المتعلق بقواعد وإجراءات التأديب في الإدارات العمومية...',
      contentFr: 'Contenu du décret exécutif relatif aux règles et procédures disciplinaires dans la fonction publique...',
      sourceUrl: 'https://www.joradp.dz/FTP/jo-arabe/2024/A2024789.pdf',
    }
  ];

  // Filter by category if specified (in real implementation, this would come from the data)
  const filtered = sampleLaws.filter(law => 
    category === 'جميع' || law.category === category || category === 'إداري'
  );

  return filtered.slice(0, limit);
}

// Fallback data if JORADP is unavailable
function getFallbackLaws(category: string, limit: number): Array<any> {
  return [
    {
      titleAr: 'المرسوم التنفيذي المتضمن قواعد التوظيف في القطاع العمومي',
      titleFr: 'Décret exécutif relatif aux règles de recrutement dans la fonction publique',
      referenceNumber: 'FB-001',
      category: 'إداري',
      lawType: 'مرسوم تنفيذي',
      year: new Date().getFullYear(),
      jorfYear: new Date().getFullYear(),
      jorfNumber: 1,
      publicationDate: `${new Date().getFullYear()}-01-01`,
      journalOfficiel: `JORF 1/${new Date().getFullYear()}`,
      descriptionAr: 'مرسوم تنفيذي يحدد قواعد وشروط التوظيف في الإدارات والمؤسسات العمومية',
      descriptionFr: 'Décret exécutif établissant les règles et conditions de recrutement dans les administrations publiques',
      contentAr: 'محتوى المرسوم التنفيذي المتعلق بشروط التوظيف والمؤهلات المطلوبة للوظائف العمومية...',
      contentFr: 'Contenu du décret exécutif relatif aux conditions d\'embauche et aux qualifications requises pour les postes publics...',
      sourceUrl: `https://www.joradp.dz/FTP/jo-arabe/${new Date().getFullYear()}/A${new Date().getFullYear()}001.pdf`,
    }
  ].slice(0, limit);
}