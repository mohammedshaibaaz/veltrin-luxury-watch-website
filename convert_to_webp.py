from PIL import Image
import os

# Get all JPG and PNG files
files = [f for f in os.listdir('.') if f.endswith(('.jpg', '.png'))]
print(f'Found {len(files)} images to convert')

# Convert each file
for f in files:
    try:
        img = Image.open(f)
        output_name = f.rsplit('.', 1)[0] + '.webp'
        img.save(output_name, 'WEBP', quality=85)
        original_size = os.path.getsize(f)
        new_size = os.path.getsize(output_name)
        reduction = round((1 - new_size/original_size) * 100, 1)
        print(f'✓ {f} → {output_name} ({reduction}% smaller)')
    except Exception as e:
        print(f'✗ Error converting {f}: {e}')

print('\nConversion complete!')
