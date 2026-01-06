#!/usr/bin/env python3
"""
Build script for MultiSearch extension
Creates a clean .zip file ready for Chrome Web Store submission

Usage:
    python scripts/build.py
"""

import json
import os
import shutil
import sys
import zipfile
from pathlib import Path

# Colors for Windows/Unix terminal output
class Colors:
    """ANSI color codes for terminal output"""
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    NC = '\033[0m'  # No Color

    @staticmethod
    def supports_color():
        """Check if terminal supports colors"""
        return hasattr(sys.stdout, 'isatty') and sys.stdout.isatty()

    @classmethod
    def colorize(cls, text, color):
        """Colorize text if terminal supports it"""
        if cls.supports_color():
            return f"{color}{text}{cls.NC}"
        return text


def print_color(text, color):
    """Print colored text"""
    print(Colors.colorize(text, color))


def print_header(text):
    """Print blue header"""
    print_color(f"🔨 {text}", Colors.BLUE)


def print_success(text):
    """Print green success message"""
    print_color(f"  ✓ {text}", Colors.GREEN)


def print_warning(text):
    """Print yellow warning message"""
    print_color(f"  ⚠ {text}", Colors.YELLOW)


def print_error(text):
    """Print red error message"""
    print_color(f"  ✗ {text}", Colors.RED)


def get_manifest_version():
    """Read version from manifest.json"""
    manifest_path = Path("manifest.json")

    if not manifest_path.exists():
        print_error("manifest.json not found")
        sys.exit(1)

    try:
        with open(manifest_path, 'r', encoding='utf-8') as f:
            manifest = json.load(f)

        version = manifest.get('version')
        if not version:
            print_error("Version not found in manifest.json")
            sys.exit(1)

        return version
    except json.JSONDecodeError as e:
        print_error(f"Invalid JSON in manifest.json: {e}")
        sys.exit(1)
    except Exception as e:
        print_error(f"Failed to read manifest.json: {e}")
        sys.exit(1)


def clean_previous_builds(build_dir, version):
    """Remove previous build artifacts"""
    print_warning("🗑️  Cleaning previous builds...")

    # Remove build directory
    if build_dir.exists():
        shutil.rmtree(build_dir)

    # Remove old zip files
    for zip_file in Path(".").glob("search-switcher-v*.zip"):
        zip_file.unlink()
        print_success(f"Removed {zip_file}")


def create_build_directory(build_dir):
    """Create build directory"""
    print_warning("📁 Creating build directory...")
    build_dir.mkdir(parents=True, exist_ok=True)
    print_success(f"Created {build_dir}")


def copy_files(build_dir):
    """Copy necessary files to build directory"""
    print_warning("📋 Copying files...")

    files_to_copy = [
        "manifest.json",
        "content.js",
        "LICENSE",
        "README.md",
        "icon48.png",
        "icon128.png",
        "icon.svg"
    ]

    copied_count = 0
    missing_files = []

    for filename in files_to_copy:
        source = Path(filename)
        destination = build_dir / filename

        if source.exists():
            shutil.copy2(source, destination)
            print_success(filename)
            copied_count += 1
        else:
            print_error(f"{filename} (missing)")
            missing_files.append(filename)

    if missing_files:
        print_warning(f"Warning: {len(missing_files)} files missing")

    return copied_count, missing_files


def create_zip(build_dir, zip_name):
    """Create zip archive from build directory"""
    print_warning("🗜️  Creating zip archive...")

    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file_path in build_dir.rglob('*'):
            if file_path.is_file():
                arcname = file_path.relative_to(build_dir)
                zipf.write(file_path, arcname)

    print_success(f"Created {zip_name}")


def verify_zip(zip_name):
    """Verify zip contents"""
    print_warning("🔍 Verifying package...")

    print("\n  Package contents:")
    with zipfile.ZipFile(zip_name, 'r') as zipf:
        for info in zipf.filelist:
            # Only show actual files with extensions
            if any(info.filename.endswith(ext) for ext in ['.json', '.js', '.png', '.svg', '.md']):
                size_kb = info.file_size / 1024
                print(f"    • {info.filename:<30} ({size_kb:>6.1f} KB)")


def get_file_size(file_path):
    """Get human-readable file size"""
    size_bytes = file_path.stat().st_size

    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0

    return f"{size_bytes:.1f} TB"


def print_summary(zip_name, version):
    """Print build summary"""
    zip_path = Path(zip_name)
    size = get_file_size(zip_path)

    print()
    print_color("✅ Build complete!", Colors.GREEN)
    print("=" * 50)
    print_color(f"Package: {zip_name}", Colors.BLUE)
    print_color(f"Size: {size}", Colors.BLUE)
    print_color(f"Version: {version}", Colors.BLUE)
    print()
    print_color("📤 Next steps:", Colors.YELLOW)
    print("1. Test the extension locally first")
    print("2. Upload to Chrome Web Store Developer Dashboard")
    print(f"3. Or create a GitHub release with: git tag v{version} && git push --tags")
    print()


def main():
    """Main build process"""
    # Change to repository root if running from scripts/ directory
    if Path.cwd().name == 'scripts':
        os.chdir('..')

    # Print header
    print_header("Building MultiSearch Extension")
    print("=" * 50)

    # Get version
    version = get_manifest_version()
    print_color(f"📦 Version: {version}", Colors.BLUE)
    print()

    # Setup paths
    build_dir = Path("build")
    zip_name = f"search-switcher-v{version}.zip"

    try:
        # Clean previous builds
        clean_previous_builds(build_dir, version)

        # Create build directory
        create_build_directory(build_dir)

        # Copy files
        copied_count, missing_files = copy_files(build_dir)

        if missing_files and len(missing_files) > 3:
            print_error("Too many missing files. Build aborted.")
            sys.exit(1)

        # Create zip
        create_zip(build_dir, zip_name)

        # Verify zip
        verify_zip(zip_name)

        # Print summary
        print_summary(zip_name, version)

    except KeyboardInterrupt:
        print()
        print_error("Build cancelled by user")
        sys.exit(1)
    except Exception as e:
        print()
        print_error(f"Build failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
