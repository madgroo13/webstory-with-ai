export function getIcon(name) { 
    const n = name.toLowerCase(); 
    if(n.includes('key')||n.includes('kunci')) return '🔑'; 
    if(n.includes('potion')||n.includes('obat')) return '🧪'; 
    if(n.includes('sword')||n.includes('knife')||n.includes('axe')) return '🗡️'; 
    if(n.includes('gun')||n.includes('revolver')) return '🔫'; 
    if(n.includes('map')||n.includes('book')||n.includes('note')) return '📜'; 
    if(n.includes('food')||n.includes('bread')||n.includes('water')) return '🍱'; 
    if(n.includes('light')||n.includes('torch')) return '🔦'; 
    if(n.includes('tech')||n.includes('chip')||n.includes('usb')) return '💾'; 
    if(n.includes('coin')||n.includes('wallet')) return '💰'; 
    return '📦'; 
}