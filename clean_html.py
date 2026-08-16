import json
import re

def clean_html(html_str):
    if not html_str: return html_str
    
    # Remove <div class="statusbar">...</div>
    html_str = re.sub(r'<div class="statusbar".*?</div>', '', html_str, flags=re.DOTALL)
    
    # Remove inline status bar: <div style="display:flex; justify-content:space-between; ..."><span>9:41</span>...</div>
    html_str = re.sub(r'<div[^>]*>.*?<span>9:41</span>.*?</div>', '', html_str, flags=re.DOTALL)
    
    # Replace .phone with a 100% container or just strip the phone class
    html_str = html_str.replace('class="phone"', 'class="phone-cleaned" style="width:100%; height:100%; display:flex; flex-direction:column;"')
    
    # Replace the fixed size wrappers in insurance/index
    html_str = re.sub(r'width:\s*2[78]0px;\s*height:\s*5[68]0px;', 'width: 100%; height: 100%;', html_str)
    
    return html_str

for module_file in ['insuranceModule.json', 'indexFundsModule.json', 'creditCardModule.json']:
    path = f'mobile/src/data/{module_file}'
    with open(path, 'r') as f:
        data = json.load(f)
    for slide in data['slides']:
        if 'html' in slide and slide['html']:
            slide['html'] = clean_html(slide['html'])
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)

print("Cleaned JSON files.")
