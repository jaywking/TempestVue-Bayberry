# Define the path to the .env.local file
$envFilePath = "c:\utils\TempestVue\.env.local"

# Check if the .env.local file exists
if (Test-Path -Path $envFilePath) {
    # Read the contents of the .env.local file
    $envContent = Get-Content -Path $envFilePath

    # Initialize an array to store any errors found
    $errors = @()

    # Iterate through each line in the .env.local file
    foreach ($line in $envContent) {
        # Skip empty lines and comments
        if ($line.Trim() -eq "" -or $line.Trim().StartsWith("#")) {
            continue
        }

        # Check if the line contains an equal sign
        if (-not ($line -match "=")) {
            $errors += "Line '$line' is missing an equal sign."
            continue
        }

        # Split the line into key and value
        $parts = $line.Split("=", 2)
        $key = $parts[0].Trim()
        $value = $parts[1].Trim(' ', '"')

        # Check for empty key
        if ($key -eq "") {
            $errors += "Line '$line' has an empty key."
        }

        # Check for empty value
        if ($value -eq "") {
            $errors += "Line '$line' has an empty value."
        }
    }

    # Output the results
    if ($errors.Count -eq 0) {
        Write-Host "No issues found in the .env.local file."
    } else {
        Write-Host "Issues found in the .env.local file:"
        $errors | ForEach-Object { Write-Host $_ }
    }
} else {
    Write-Host "The .env.local file does not exist at the specified path."
}
