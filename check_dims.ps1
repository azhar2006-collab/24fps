Add-Type -AssemblyName System.Drawing

$srcDir = "C:\Users\Rajagopal\.gemini\antigravity\brain\653045f1-3f73-4c3d-9c55-ecc9e9b65d23\.user_uploaded"
$outDir = "c:\Users\Rajagopal\OneDrive\Desktop\24fps\clients"

if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

$items = @(
    @{ file = "media_1790320490920.png"; name = "mighty-fitness"; title = "The Mighty Fitness World"; category = "Fitness & Wellness" },
    @{ file = "media_1790320496876.png"; name = "gnc-india"; title = "GNC India"; category = "Health & Nutrition" },
    @{ file = "media_1790320503776.png"; name = "aroos-makeover"; title = "Aroos Makeover"; category = "Beauty & Luxury" },
    @{ file = "media_1790320519619.png"; name = "77-fitness-studio"; title = "77 Fitness Studio"; category = "Elite Fitness Studio" },
    @{ file = "media_1790320590073.png"; name = "high-on-fitness"; title = "High On Fitness"; category = "Strength & Training" }
)

foreach ($item in $items) {
    $filePath = Join-Path $srcDir $item.file
    $img = [System.Drawing.Image]::FromFile($filePath)
    $w = $img.Width
    $h = $img.Height
    Write-Host "$($item.name): ${w}x${h}"
    $img.Dispose()
}
