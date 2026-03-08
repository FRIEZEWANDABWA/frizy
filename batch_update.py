import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# We'll use absolute paths or relative securely.
logo_old = '<div class="logo-icon"><i class="fas fa-microchip"></i></div>'
logo_new = '<img src="/images/profile%20photo.webp" alt="Frieze Wandabwa" class="logo-icon" style="padding:0;object-fit:cover;">'

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Logo replacement
    if logo_old in content:
        content = content.replace(logo_old, logo_new)
        
    # Open Graph image replacement (could be many variations with static/ or profile photo.jpg etc.)
    # Let's cleanly enforce the correct og:image
    content = re.sub(r'content="https://(?:www\.)?friezewandabwa\.it\.com(?:[^"]*images/[^"]*)"',
                     'content="https://www.friezewandabwa.it.com/images/profile%20photo.webp"',
                     content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("HTML updates completed.")
