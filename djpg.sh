#!/usr/bin/env python3
"""
Memory-efficient script to delete all .jpg and .jpeg files in a directory and subdirectories.
USE WITH CAUTION - This permanently deletes files!
"""

import os
import sys
from pathlib import Path

def count_jpg_files(directory):
    """Count JPG/JPEG files without loading all into memory."""
    count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg')):
                count += 1
    return count

def delete_jpg_files(directory, preview_limit=50):
    """
    Delete all .jpg and .jpeg files in the specified directory and subdirectories.
    Processes files one at a time to avoid memory issues.
    
    Args:
        directory: Path to the directory to search
        preview_limit: Maximum number of files to show in preview
    """
    directory = Path(directory)
    
    if not directory.exists():
        print(f"Error: Directory '{directory}' does not exist.")
        return
    
    if not directory.is_dir():
        print(f"Error: '{directory}' is not a directory.")
        return
    
    print("Counting files...")
    total_count = count_jpg_files(directory)
    
    if total_count == 0:
        print(f"No .jpg or .jpeg files found in '{directory}'")
        return
    
    print(f"\nFound {total_count} JPG/JPEG files")
    
    # Show preview of first N files
    print(f"\nPreview (first {min(preview_limit, total_count)} files):")
    preview_count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg')):
                if preview_count < preview_limit:
                    print(f"  - {os.path.join(root, file)}")
                    preview_count += 1
                else:
                    break
        if preview_count >= preview_limit:
            break
    
    if total_count > preview_limit:
        print(f"  ... and {total_count - preview_limit} more files")
    
    # Confirm deletion
    response = input(f"\nDelete all {total_count} JPG/JPEG files? (yes/no): ")
    
    if response.lower() not in ['yes', 'y']:
        print("Deletion cancelled.")
        return
    
    # Delete files one by one
    deleted_count = 0
    failed_count = 0
    
    print("\nDeleting files...")
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg')):
                filepath = os.path.join(root, file)
                try:
                    os.remove(filepath)
                    deleted_count += 1
                    if deleted_count % 100 == 0:
                        print(f"Progress: {deleted_count}/{total_count} deleted")
                except Exception as e:
                    print(f"Failed to delete {filepath}: {e}")
                    failed_count += 1
    
    print(f"\nSummary:")
    print(f"  Deleted: {deleted_count} files")
    if failed_count > 0:
        print(f"  Failed: {failed_count} files")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python delete_jpg.py <directory>")
        print("Example: python delete_jpg.py /path/to/directory")
        sys.exit(1)
    
    target_directory = sys.argv[1]
    delete_jpg_files(target_directory)
