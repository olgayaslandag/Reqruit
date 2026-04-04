<?php

// PHP script to add strict_types declaration to all PHP files

function addStrictTypes($directory)
{
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($directory)
    );

    foreach ($iterator as $file) {
        if ($file->isFile() && $file->getExtension() === 'php') {
            $content = file_get_contents($file->getPathname());

            // Skip if strict_types already exists
            if (strpos($content, 'declare(strict_types=1);') !== false) {
                continue;
            }

            // Check if file starts with <?php
            if (preg_match('/^<\?php/', $content)) {
                // Add strict_types after <?php
                $newContent = preg_replace('/^<\?php\s*/', "<?php\n\ndeclare(strict_types=1);\n", $content, 1);
                file_put_contents($file->getPathname(), $newContent);
                echo 'Updated: '.$file->getPathname()."\n";
            }
        }
    }
}

// Process all php files in the app directory
addStrictTypes('/projects/reqruit/app');
