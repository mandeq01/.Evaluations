// ===== STORAGE =====
const users = JSON.parse(localStorage.getItem('users')) || [];
const evaluations = JSON.parse(localStorage.getItem('evaluations')) || [];
let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || null;

// ===== STAR RATING FUNCTIONALITY =====
const ratingDivs = document.querySelectorAll('.rating');
ratingDivs.forEach(function(div){
    const stars = div.querySelectorAll('span');
    stars.forEach(function(star, index){
        star.addEventListener('mouseover', function(){
            stars.forEach(function(s, i){ s.classList.toggle('hover', i <= index); });
        });
        star.addEventListener('mouseout', function(){
            stars.forEach(function(s){ s.classList.remove('hover'); });
        });
        star.addEventListener('click', function(){
            div.dataset.value = index + 1;
            stars.forEach(function(s, i){ s.classList.toggle('selected', i <= index); });
        });
    });
});

// ===== EVALUATION FORM =====
const evalForm = document.getElementById('evaluationForm');
const evalMessage = document.getElementById('eval-message');

if(evalForm){
    if(!loggedInUser){
        evalForm.style.display = 'none';
        evalMessage.textContent = "Please login to submit an evaluation.";
    } else {
        evalForm.style.display = 'block';
        evalMessage.textContent = `Welcome, ${loggedInUser.name}! You can submit an evaluation.`;

        evalForm.addEventListener('submit', function(e){
            e.preventDefault();

            const hospital = document.getElementById('hospital').value;
            if(!hospital){ alert('Select a hospital'); return; }

            const aspects = ['doctor','waiting','cleanliness','treatment','staff'];
            const evalData = {hospital: hospital, user: loggedInUser.name};

            for(let i = 0; i < aspects.length; i++){
                const val = document.querySelector(`.rating[data-aspect="${aspects[i]}"]`).dataset.value;
                if(!val){ alert('Rate ' + aspects[i]); return; }
                evalData[aspects[i]] = parseInt(val);
            }

            evaluations.push(evalData);
            localStorage.setItem('evaluations', JSON.stringify(evaluations));

            evalMessage.textContent = 'Evaluation submitted successfully!';
            resetEvaluationForm();
            updateStats();
        });
    }
}

// ===== RESET EVALUATION FORM =====
function resetEvaluationForm(){
    evalForm.reset();
    ratingDivs.forEach(function(div){
        div.dataset.value = 0;
        div.querySelectorAll('span').forEach(function(s){ s.classList.remove('selected'); });
    });
}

// ===== UPDATE STATS =====
function updateStats(){
    const total = evaluations.length;
    const last = total > 0 ? evaluations[total-1].hospital : 'None';
    let avg = 0;

    if(total > 0){
        let sum = 0, count = 0;
        evaluations.forEach(function(ev){
            sum += ev.doctor + ev.waiting + ev.cleanliness + ev.treatment + ev.staff;
            count += 5;
        });
        avg = (sum / count).toFixed(1);
    }

    const totalE = document.getElementById('total-evals');
    if(totalE) totalE.textContent = total;

    const lastH = document.getElementById('last-hospital');
    if(lastH) lastH.textContent = last;

    const avgR = document.getElementById('avg-rating');
    if(avgR) avgR.textContent = avg;

    const ratingEls = document.querySelectorAll('.hospital-rating');
    ratingEls.forEach(function(el){
        const hname = el.dataset.hospital;
        const hEval = evaluations.filter(function(ev){ return ev.hospital === hname; });
        if(hEval.length > 0){
            let sum = 0;
            hEval.forEach(function(ev){ sum += ev.doctor + ev.waiting + ev.cleanliness + ev.treatment + ev.staff; });
            const avg = (sum / (hEval.length * 5)).toFixed(1);
            el.textContent = avg;
        }
    });
}
updateStats();

// ===== SIGNUP FORM =====
const signupForm = document.getElementById('signupForm');
if(signupForm){
    signupForm.addEventListener('submit', function(e){
        e.preventDefault();

        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const pass = document.getElementById('signup-password').value;
        const pass2 = document.getElementById('signup-password2').value;

        if(!name || !email || !pass || !pass2){
            alert('All fields are required');
            return;
        }

        const nameRegex = /^[A-Za-z\s]+$/;
        if(!nameRegex.test(name)){
            alert('Name must contain only letters and spaces');
            return;
        }

        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!passRegex.test(pass)){
            alert('Password must be 8+ chars, include uppercase, lowercase, number & special char');
            return;
        }

        if(pass !== pass2){
            alert('Passwords do not match');
            return;
        }

        users.push({name: name, email: email, password: pass});
        localStorage.setItem('users', JSON.stringify(users));

        document.getElementById('signup-message').textContent = 'Signup successful! You can now login.';
        signupForm.reset();
    });
}

// ===== LOGIN FORM =====
const loginForm = document.getElementById('loginForm');
if(loginForm){
    loginForm.addEventListener('submit', function(e){
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-password').value;
        const user = users.find(function(u){ return u.email === email && u.password === pass; });

        if(user){
            loggedInUser = user;
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            document.getElementById('login-message').textContent = `Login successful! Welcome ${user.name}`;
            loginForm.reset();
            if(evalForm){
                evalForm.style.display = 'block';
                evalMessage.textContent = `Welcome, ${loggedInUser.name}! You can submit an evaluation.`;
            }
        } else {
            document.getElementById('login-message').textContent = 'Invalid credentials';
        }
    });
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if(contactForm){
    contactForm.addEventListener('submit', function(e){
        e.preventDefault();

        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const msg = document.getElementById('contact-message').value.trim();

        if(!name || !email || !msg){ 
            alert('All fields required'); 
            return; 
        }

        const nameRegex = /^[A-Za-z\s]+$/;
        if(!nameRegex.test(name)){
            alert('Name must contain only letters and spaces');
            return;
        }

        document.getElementById('contact-feedback').textContent = 'Thank you, your message has been sent!';
        contactForm.reset();
    });
}

