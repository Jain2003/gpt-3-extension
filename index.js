const checkForKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
      resolve(result['openai-key']);
    });
  });
};

const encode = (input) => {
  return btoa(input);
};

const saveKey = () => {
  const input = document.getElementById('key_input');

if (input) {
  const { value } = input;  
  if(value.trim() === ''){
    alert('You cannot leave this field empty, please refresh the page and try again.');
    return;
  }

  const encodedValue = encode(value);

  chrome.storage.local.set({ 'openai-key': encodedValue }, () => {
    document.getElementById('key_needed').style.display = 'none';
    document.getElementById('key_entered').style.display = 'block';
  });
}
}

const changeKey = () => {
  chrome.storage.local.remove(['openai-key']);
  document.getElementById('key_needed').style.display = 'block';
  document.getElementById('key_entered').style.display = 'none';
};

document.getElementById('save_key_button').addEventListener('click', saveKey);
document.getElementById('change_key_button').addEventListener('click', changeKey);

checkForKey().then((response) => {
  if (response) {
    document.getElementById('key_needed').style.display = 'none';
    document.getElementById('key_entered').style.display = 'block';
  }
});