"""
Convert PNG logo to ICO format for Windows executable and installer
"""

from PIL import Image

# Open the PNG image
img = Image.open('web/assets/icons/techtonicml.png')

# Convert to ICO with multiple sizes (for Windows compatibility)
# Windows uses different sizes for different contexts
img.save('web/assets/icons/techtonicml.ico', format='ICO', 
         sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])

print("Successfully converted PNG to ICO format!")
print("Created: web/assets/icons/techtonicml.ico")
