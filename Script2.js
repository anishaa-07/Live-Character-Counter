(function(){
      const textarea = document.getElementById('message');
      const status = document.getElementById('status');
      const maxChars = Number(textarea.getAttribute('maxlength')) || 100;
      const orangeThreshold = 0.5;  
      const redThreshold = 0.2;    

      function updateCounter() {
        const len = textarea.value.length;
        const remaining = Math.max(0, maxChars - len);
        status.textContent = remaining;

        const fraction = remaining / maxChars;

        status.classList.remove('green','orange','red','pulse');

        if (fraction <= redThreshold) {
          status.classList.add('red','pulse');
        } else if (fraction <= orangeThreshold) {
          status.classList.add('orange');
        } else {
          status.classList.add('green');
        }

        textarea.setAttribute('aria-valuemax', maxChars);
        textarea.setAttribute('aria-valuenow', len);
      }

      function enforceLimit() {
        if (textarea.value.length > maxChars) {
          textarea.value = textarea.value.slice(0, maxChars);
        }
      }

      textarea.addEventListener('paste', function(e){
        const clipboard = (e.clipboardData || window.clipboardData).getData('text') || '';
        const cur = textarea.value;
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;
        const before = cur.slice(0, selectionStart);
        const after  = cur.slice(selectionEnd);
        const allowed = maxChars - (before.length + after.length);

        if (allowed <= 0) {
          e.preventDefault();
          status.classList.add('pulse');
          setTimeout(()=>status.classList.remove('pulse'), 200);
          return;
        }
        if (clipboard.length > allowed) {
          e.preventDefault();
          const toInsert = clipboard.slice(0, allowed);
          const newText = before + toInsert + after;
          textarea.value = newText;
          const caret = before.length + toInsert.length;
          textarea.setSelectionRange(caret, caret);
          updateCounter();
        }
      });

      textarea.addEventListener('input', function(){
        enforceLimit();
        updateCounter();
      });

      textarea.addEventListener('keydown', function(e){
        const len = textarea.value.length;
        const isPrintable = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

        if (isPrintable && len >= maxChars) {
          e.preventDefault();
          status.classList.add('pulse');
          setTimeout(()=>status.classList.remove('pulse'), 200);
        }
      });
      updateCounter();

      window.charCounter = { updateCounter, maxChars };
    })();