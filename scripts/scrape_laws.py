#!/usr/bin/env python3
"""
Algerian Legal Data Scraper
Extracts laws from official Algerian government sources:
- PRIMARY: https://www.joradp.dz (Journal Officiel)
- SECONDARY: https://www.mjustice.dz
- TERTIARY: https://www.droit-dz.com
"""

import json
import re
import logging
from datetime import datetime
from typing import Optional, Dict, List, Any
from pathlib import Path

import requests
from bs4 import BeautifulSoup
import pdfplumber

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class AlgerianLawScraper:
    """Scraper for Algerian legal texts from official sources."""

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept-Language': 'ar,fr-FR,en-US;q=0.9',
        })

    @property
    def output_dir(self) -> Path:
        return Path(__file__).parent / 'data'

    def ensure_dirs(self):
        self.output_dir.mkdir(exist_ok=True, parents=True)

    def scrape_joradp(self) -> List[Dict[str, Any]]:
        """Scrape laws from Journal Officiel (joradp.dz)"""
        laws = []
        try:
            logger.info("Scraping joradp.dz...")
            response = self.session.get(
                'https://www.joradp.dz/ar/jo/',
                timeout=30
            )
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            law_links = soup.select('a[href*="loi"], a[href*="JO"]')
            for link in law_links[:20]:
                try:
                    law_data = self._parse_joradp_law(link)
                    if law_data:
                        laws.append(law_data)
                except Exception as e:
                    logger.warning(f"Error parsing law link: {e}")
                    continue

        except requests.RequestException as e:
            logger.error(f"Error accessing joradp.dz: {e}")

        return laws

    def _parse_joradp_law(self, link) -> Optional[Dict[str, Any]]:
        """Parse individual law from joradp.dz"""
        href = link.get('href', '')
        if not href.startswith('http'):
            href = f"https://www.joradp.dz{href}"

        try:
            response = self.session.get(href, timeout=30)
            soup = BeautifulSoup(response.text, 'html.parser')

            title = link.get_text(strip=True)
            return {
                'title_ar': title,
                'title_fr': title,
                'reference_number': self._extract_ref_number(title),
                'law_type': self._identify_law_type(title),
                'year': self._extract_year(title),
                'jorf_issue_number': None,
                'date_published': datetime.now().strftime('%Y-%m-%d'),
                'full_text_ar': soup.get_text(strip=True)[:500],
                'full_text_fr': soup.get_text(strip=True)[:500],
                'category': self._identify_category(title),
                'articles': []
            }
        except Exception as e:
            logger.warning(f"Error parsing law: {e}")
            return None

    def scrape_mjustice(self) -> List[Dict[str, Any]]:
        """Scrape laws from Ministry of Justice (mjustice.dz)"""
        laws = []
        try:
            logger.info("Scraping mjustice.dz...")
            response = self.session.get(
                'https://www.mjustice.dz',
                timeout=30
            )
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            law_links = soup.select('a[href*=".pdf"]')
            for link in law_links[:15]:
                try:
                    law_data = self._parse_mjustice_law(link)
                    if law_data:
                        laws.append(law_data)
                except Exception as e:
                    logger.warning(f"Error parsing law: {e}")
                    continue

        except requests.RequestException as e:
            logger.error(f"Error accessing mjustice.dz: {e}")

        return laws

    def _parse_mjustice_law(self, link) -> Optional[Dict[str, Any]]:
        """Parse law from mjustice.dz"""
        href = link.get('href', '')
        title = link.get_text(strip=True)

        pdf_content = None
        if href.startswith('http'):
            try:
                pdf_response = self.session.get(href, timeout=30)
                if 'pdf' in pdf_response.headers.get('Content-Type', ''):
                    pdf_path = self.output_dir / 'temp.pdf'
                    with open(pdf_path, 'wb') as f:
                        f.write(pdf_response.content)
                    pdf_content = self._extract_pdf_text(pdf_path)
            except Exception as e:
                logger.warning(f"Error downloading PDF: {e}")

        return {
            'title_ar': title,
            'title_fr': title,
            'reference_number': self._extract_ref_number(title),
            'law_type': self._identify_law_type(title),
            'year': self._extract_year(title),
            'jorf_issue_number': None,
            'date_published': datetime.now().strftime('%Y-%m-%d'),
            'full_text_ar': pdf_content or title,
            'full_text_fr': pdf_content or title,
            'category': 'تشريع',
            'articles': []
        }

    def scrape_droitdz(self) -> List[Dict[str, Any]]:
        """Scrape laws from droit-dz.com"""
        laws = []
        try:
            logger.info("Scraping droit-dz.com...")
            response = self.session.get(
                'https://www.droit-dz.com',
                timeout=30
            )
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            law_cards = soup.select('article.law, div.law-card, a[href*="loi"]')
            for card in law_cards[:20]:
                try:
                    law_data = self._parse_droitdz_law(card)
                    if law_data:
                        laws.append(law_data)
                except Exception as e:
                    logger.warning(f"Error parsing law card: {e}")
                    continue

        except requests.RequestException as e:
            logger.error(f"Error accessing droit-dz.com: {e}")

        return laws

    def _parse_droitdz_law(self, card) -> Optional[Dict[str, Any]]:
        """Parse law from droit-dz.com"""
        title = card.get_text(strip=True) if hasattr(card, 'get_text') else str(card)
        href = card.get('href', '')

        if href and not href.startswith('http'):
            href = f"https://www.droit-dz.com{href}"

        return {
            'title_ar': title,
            'title_fr': title,
            'reference_number': self._extract_ref_number(title),
            'law_type': self._identify_law_type(title),
            'year': self._extract_year(title),
            'jorf_issue_number': None,
            'date_published': datetime.now().strftime('%Y-%m-%d'),
            'full_text_ar': title,
            'full_text_fr': title,
            'category': self._identify_category(title),
            'articles': []
        }

    def _extract_pdf_text(self, pdf_path: Path) -> str:
        """Extract text from PDF using pdfplumber"""
        try:
            with pdfplumber.open(pdf_path) as pdf:
                text = '\n'.join(page.extract_text() or '' for page in pdf.pages)
            pdf_path.unlink(missing_ok=True)
            return text[:2000]
        except Exception as e:
            logger.warning(f"Error extracting PDF text: {e}")
            return ""

    def _extract_ref_number(self, text: str) -> str:
        """Extract reference number from law title"""
        patterns = [
            r'رقم\s*\d{2,4}[-/]\d+',
            r'编号\d+',
            r'Law\s*N[°o]?\s*\d+',
            r'Décret\s*N[°o]?\s*\d+',
            r'أمر\s*رقم',
            r'قانون\s*رقم',
            r'مرسوم\s*رئاسي',
        ]
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(0)
        return text[:50]

    def _extract_year(self, text: str) -> Optional[int]:
        """Extract year from text"""
        year_match = re.search(r'(19|20)\d{2}', text)
        if year_match:
            return int(year_match.group(0))
        return datetime.now().year

    def _identify_law_type(self, text: str) -> str:
        """Identify law type from text"""
        types = {
            'دستور': 'دستور',
            'قانون': 'قانون',
            'أمر': 'أمر',
            'مرسوم رئاسي': 'مرسوم رئاسي',
            'مرسوم تنفيذي': 'مرسوم تنفيذي',
            'منشور': 'منشور',
            'تعليمة': 'تعليمة',
            'Constitution': 'دستور',
            'Loi': 'قانون',
            'Décret': 'مرسوم',
            'Ordonnance': 'أمر',
        }
        for key, law_type in types.items():
            if key in text:
                return law_type
        return 'قانون'

    def _identify_category(self, text: str) -> str:
        """Identify law category"""
        categories = {
            'دستور': 'دستور',
            'بيئة': 'بيئة وتهيئة عمرانية',
            'مالية': 'مالية عامة',
            'جباية': 'جباية',
            'وظيف': 'وظيف عمومي',
            'بلدية': 'إدارة محلية',
            'ولاية': 'إدارة محلية',
            'صفقات': 'صفقات عمومية',
            'تعليم': 'تعليم عالي',
            'famille': 'قانون أسري',
            'travail': 'قانون work',
            'civil': 'قانون مدني',
            'pénal': 'قانون جنائي',
        }
        for key, category in categories.items():
            if key in text.lower():
                return category
        return 'تشريع'

    def merge_and_save(self, laws_raw: List[Dict], laws_seed_path: Path):
        """Merge scraped laws with seed data"""
        with open(laws_seed_path, 'r', encoding='utf-8') as f:
            seed_data = json.load(f)

        seed_laws = {law['reference_number']: law for law in seed_data['laws']}

        for law in laws_raw:
            ref = law.get('reference_number')
            if ref and ref not in seed_laws:
                seed_data['laws'].append(law)

        output_path = self.output_dir / 'laws_raw.json'
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(seed_data, f, ensure_ascii=False, indent=2)

        logger.info(f"Merged data saved to {output_path}")
        return output_path


def main():
    """Main execution function"""
    scraper = AlgerianLawScraper()
    scraper.ensure_dirs()

    all_laws = []

    laws_joradp = scraper.scrape_joradp()
    all_laws.extend(laws_joradp)
    logger.info(f"Scraped {len(laws_joradp)} laws from joradp.dz")

    laws_mjustice = scraper.scrape_mjustice()
    all_laws.extend(laws_mjustice)
    logger.info(f"Scraped {len(laws_mjustice)} laws from mjustice.dz")

    laws_droitdz = scraper.scrape_droitdz()
    all_laws.extend(laws_droitdz)
    logger.info(f"Scraped {len(laws_droitdz)} laws from droit-dz.com")

    seed_path = scraper.output_dir / 'laws_seed.json'
    scraper.merge_and_save(all_laws, seed_path)

    logger.info(f"Total laws scraped: {len(all_laws)}")


if __name__ == '__main__':
    main()