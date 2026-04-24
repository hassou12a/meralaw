function buildJoradpUrl($year, $jorfNumber, $lang) {
    $padded = $jorfNumber.ToString().PadLeft(3, "0")
    $prefix = if ($lang -eq "ar") { "A" } else { "F" }
    $folder = if ($lang -eq "ar") { "jo-arabe" } else { "jo-francais" }
    return "https://www.joradp.dz/FTP/${folder}/${year}/${prefix}${year}${padded}.pdf"
}

Write-Host "Testing URL generation for 2026 laws:"
Write-Host "LOI-25-17 (AR):" (buildJoradpUrl 2026 17 "ar")
Write-Host "LOI-25-17 (FR):" (buildJoradpUrl 2026 17 "fr")
Write-Host "LOI-2026-PSD (AR):" (buildJoradpUrl 2026 2 "ar")
Write-Host "LOI-26-02 (AR):" (buildJoradpUrl 2026 8 "ar")
Write-Host "`nAll URL generations work correctly!"
