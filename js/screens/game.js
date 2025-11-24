import { state } from '../state.js';
import { processTurn } from '../api.js';
import { printLog } from '../modules/ui.js';

let pendingCheck = null;

export function submitAction() { const v = document.getElementById('user-input').value.trim(); if(v) processTurn(v); } 

export function setMode(mode, data) { 
    document.getElementById('input-row').style.display = 'none'; 
    document.getElementById('choice-container').style.display = 'none'; 
    document.getElementById('dice-container').style.display = 'none'; 

    if (mode === 'text') { 
        document.getElementById('input-row').style.display = 'flex'; 
        document.getElementById('user-input').focus(); 
    } else if (mode === 'choice') { 
        const con = document.getElementById('choice-container'); 
        con.style.display = 'flex'; con.innerHTML = ''; 
        data.options.forEach(opt => { 
            const btn = document.createElement('button'); 
            btn.className = 'choice-btn'; btn.textContent = opt; 
            btn.onclick = () => processTurn(opt); 
            con.appendChild(btn); 
        }); 
    } else if (mode === 'dice') { 
        document.getElementById('dice-container').style.display = 'flex'; 
        pendingCheck = data.check; 
        document.getElementById('check-reason').textContent = `${data.check.stat} (DC ${data.check.dc})`; 
        const db = document.getElementById('dice-box'); 
        db.textContent = "D20"; db.classList.remove('dice-anim'); 
    } else { 
        document.getElementById('input-row').style.display = 'flex'; 
    } 
} 

export function rollDice() { 
    const db = document.getElementById('dice-box'); 
    db.classList.add('dice-anim'); 
    setTimeout(() => { 
        const roll = Math.floor(Math.random() * 20) + 1; 
        const bonus = state.char.stats[pendingCheck.stat] || 0; 
        const total = roll + bonus; 
        db.classList.remove('dice-anim'); db.textContent = roll; 
        const success = total >= pendingCheck.dc; 
        printLog(`Dice: ${roll} + ${bonus} = ${total}. ${success?'SUCCESS':'FAIL'}`, success?'highlight':'damage-text'); 
        setTimeout(() => processTurn(`Rolled ${total} (${success?'Success':'Fail'})`, true), 1000); 
    }, 600); 
} 
