#!/bin/bash

# Script to add strict_types declaration to PHP files that don't have it

# Process all PHP files in the app directory
find /projects/reqruit/app -name "*.php" -exec sh -c '
    for file; do
        # Check if the file already has strict_types declaration
        if ! grep -q "^declare(strict_types=1);" "$file"; then
            # Check if the file contains '<?php' on the first line
            if head -n 1 "$file" | grep -q "<?php"; then
                # Create a temporary file with the strict_types declaration added
                temp_file=$(mktemp)
                
                # Add declare statement after <?php
                awk 'NR==1{print; print "\ndeclare(strict_types=1);\n"} NR>1' "$file" > "$temp_file"
                
                # Move temp file to original file
                mv "$temp_file" "$file"
                echo "Added strict_types to: $file"
            fi
        fi
    done
' sh {} +