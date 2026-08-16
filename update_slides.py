import json
import os
import re

def get_html(path):
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    return None

def update_insurance():
    json_path = 'mobile/src/data/insuranceModule.json'
    with open(json_path, 'r') as f:
        data = json.load(f)
    
    html_dir = 'extracted_check/insurance/Insurrance mdule 2'
    
    for slide in data['slides']:
        if 'filename' in slide:
            html = get_html(os.path.join(html_dir, slide['filename']))
            if html:
                slide['html'] = html
                print(f"Updated {slide['filename']} in Insurance")
            else:
                print(f"MISSING: {slide['filename']} in Insurance")
                
    with open(json_path, 'w') as f:
        json.dump(data, f, indent=2)

def update_credit_card():
    json_path = 'mobile/src/data/creditCardModule.json'
    with open(json_path, 'r') as f:
        data = json.load(f)
        
    html_dir = 'extracted_check/credit_card/credit-card-screens'
    
    # Map of slide_id to filename
    file_map = {
        'cc-s1a-script': 'screen-1a-script.html',
        'cc-s2-ghost': 'screen-2-ghost-protocol.html',
        'cc-s3-trust': 'screen-3-trust-test.html',
        'cc-s4-debit-math': 'screen-4-debit-math.html',
        'cc-s5-shield': 'screen-5-shield.html',
        'cc-s6-borrowed-time': 'screen-6-borrowed-time.html',
        'cc-s7-two-users': 'screen-7-two-users.html',
        'cc-s8-goal': 'screen-8-the-goal.html',
        'cc-s9-pivot': 'screen-9-pivot.html',
        'cc-s10-branch': 'screen-10-branch.html',
        'cc-s10b-yes-input': 'screen-10b-yes-input.html'
    }
    
    for slide in data['slides']:
        if slide['slide_id'] in file_map:
            fname = file_map[slide['slide_id']]
            html = get_html(os.path.join(html_dir, fname))
            if html:
                slide['html'] = html
                print(f"Updated {fname} in Credit Card")
                
    # Add missing slides if they aren't already there
    existing_ids = [s['slide_id'] for s in data['slides']]
    
    new_slides = []
    
    for s in data['slides']:
        new_slides.append(s)
        
        # After 1a-script, insert 1b-ad-crack
        if s['slide_id'] == 'cc-s1a-script' and 'cc-s1b-ad-crack' not in existing_ids:
            html = get_html(os.path.join(html_dir, 'screen-1b-ad-crack.html'))
            new_slides.append({
                "slide_number": len(new_slides) + 1,
                "slide_id": "cc-s1b-ad-crack",
                "description": "The Ad Crack",
                "html": html
            })
            print("Added screen-1b-ad-crack.html")
            
        # After 10-branch, insert 10a-no-income and 10c-no-card-yet
        if s['slide_id'] == 'cc-s10-branch':
            if 'cc-s10a-no-income' not in existing_ids:
                html = get_html(os.path.join(html_dir, 'screen-10a-no-income.html'))
                new_slides.append({
                    "slide_number": len(new_slides) + 1,
                    "slide_id": "cc-s10a-no-income",
                    "description": "No income route",
                    "html": html
                })
                print("Added screen-10a-no-income.html")
            if 'cc-s10c-no-card-yet' not in existing_ids:
                html = get_html(os.path.join(html_dir, 'screen-10c-no-card-yet.html'))
                new_slides.append({
                    "slide_number": len(new_slides) + 1,
                    "slide_id": "cc-s10c-no-card-yet",
                    "description": "No card yet route",
                    "html": html
                })
                print("Added screen-10c-no-card-yet.html")
                
    # Re-number slides
    for i, s in enumerate(new_slides):
        s['slide_number'] = i + 1
        
    data['slides'] = new_slides
    data['total_slides'] = len(new_slides)
    
    with open(json_path, 'w') as f:
        json.dump(data, f, indent=2)

def update_index_funds():
    json_path = 'mobile/src/data/indexFundsModule.json'
    with open(json_path, 'r') as f:
        data = json.load(f)
        
    html_dir = 'extracted_check/index_fund/Index module'
    
    file_map = {
        'idx-s1-data-preview': 'm13_screen_1_data_preview.html',
        'idx-s4-pivot-engine': 'screen_10_pivot_start_engine.html',
        'idx-s5-age-input': 'screen_11_age_input.html',
        'idx-s6-contribution': 'screen_12_contribution_input.html',
        'idx-s7-timeline': 'screen_13_the_timeline.html',
        'idx-s8-reveal': 'screen_14_output_compounding_reveal.html',
    }
    
    for slide in data['slides']:
        if slide['slide_id'] in file_map:
            fname = file_map[slide['slide_id']]
            html = get_html(os.path.join(html_dir, fname))
            if html:
                slide['html'] = html
                print(f"Updated {fname} in Index Funds")

    with open(json_path, 'w') as f:
        json.dump(data, f, indent=2)

update_insurance()
update_credit_card()
update_index_funds()
