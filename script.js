// Global variables
        let currentQuestion = 0;
        let quizTimer = null;
        let quizStartTime = null;
        let userAnswers = [];
        let currentQuizCategory = '';
        let currentIDCardData = null;

        // Quiz data
        const quizData = {
            technical: {
                title: 'Technical Quiz',
                questions: [
                    {
                        question: 'What is the time complexity of binary search?',
                        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
                        correct: 1
                    },
                    {
                        question: 'Which data structure uses LIFO principle?',
                        options: ['Queue', 'Stack', 'Array', 'Tree'],
                        correct: 1
                    },
                    {
                        question: 'What is the full form of API?',
                        options: ['Application Programming Interface', 'Advanced Programming Interface', 'Application Process Interface', 'Automated Programming Interface'],
                        correct: 0
                    },
                    {
                        question: 'Which sorting algorithm has the best average-case time complexity?',
                        options: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'],
                        correct: 1
                    },
                    {
                        question: 'What is the primary key in a database?',
                        options: ['A unique identifier', 'A foreign key', 'An index', 'A constraint'],
                        correct: 0
                    }
                ]
            },
            aptitude: {
                title: 'Aptitude Test',
                questions: [
                    {
                        question: 'If 3x + 7 = 22, what is the value of x?',
                        options: ['3', '5', '7', '9'],
                        correct: 1
                    },
                    {
                        question: 'A train travels 300 km in 3 hours. What is its speed?',
                        options: ['50 km/h', '75 km/h', '100 km/h', '150 km/h'],
                        correct: 2
                    },
                    {
                        question: 'If the ratio of boys to girls is 3:2 and there are 60 students, how many girls are there?',
                        options: ['20', '24', '30', '36'],
                        correct: 1
                    },
                    {
                        question: 'What is 15% of 200?',
                        options: ['25', '30', '35', '40'],
                        correct: 1
                    },
                    {
                        question: 'If a discount of 20% is given on an item priced at $500, what is the final price?',
                        options: ['$300', '$350', '$400', '$450'],
                        correct: 2
                    }
                ]
            },
            programming: {
                title: 'Programming Quiz',
                questions: [
                    {
                        question: 'Which keyword is used to define a constant in JavaScript?',
                        options: ['const', 'let', 'var', 'constant'],
                        correct: 0
                    },
                    {
                        question: 'What is the correct way to declare a variable in Python?',
                        options: ['var x = 5', 'x = 5', 'declare x = 5', 'int x = 5'],
                        correct: 1
                    },
                    {
                        question: 'Which loop is guaranteed to execute at least once?',
                        options: ['for loop', 'while loop', 'do-while loop', 'foreach loop'],
                        correct: 2
                    },
                    {
                        question: 'What is the purpose of the main() function in C++?',
                        options: ['Entry point of program', 'Exit point of program', 'Debug function', 'Library function'],
                        correct: 0
                    },
                    {
                        question: 'Which operator is used for inheritance in Java?',
                        options: ['extends', 'implements', 'inherits', 'super'],
                        correct: 0
                    }
                ]
            },
            general: {
                title: 'General Knowledge',
                questions: [
                    {
                        question: 'Who is the current Prime Minister of India?',
                        options: ['Narendra Modi', 'Rahul Gandhi', 'Amit Shah', 'Manmohan Singh'],
                        correct: 0
                    },
                    {
                        question: 'What is the capital of India?',
                        options: ['Mumbai', 'Delhi', 'Kolkata', 'Chennai'],
                        correct: 1
                    },
                    {
                        question: 'When did India gain independence?',
                        options: ['1945', '1946', '1947', '1948'],
                        correct: 2
                    },
                    {
                        question: 'Who wrote the Indian National Anthem?',
                        options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Rabindranath Tagore', 'Bankim Chandra Chatterjee'],
                        correct: 2
                    },
                    {
                        question: 'Which river is known as the Ganga of the South?',
                        options: ['Godavari', 'Krishna', 'Kaveri', 'Yamuna'],
                        correct: 0
                    }
                ]
            }
        };

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            initializeApp();
        });

        function initializeApp() {
            setupEventListeners();
            initializePhotoUpload();
            setupNavigation();
        }

        function setupEventListeners() {
            // Navigation
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const target = this.getAttribute('href');

        if (target.startsWith('#')) {
            e.preventDefault();  // ✅ only here
            document.querySelector(target)?.scrollIntoView({
                behavior: 'smooth'
            });
        }
        // else → allow normal navigation
    });
});

            // ID Card form
            const idCardForm = document.getElementById('idCardForm');
            if (idCardForm) {
                idCardForm.addEventListener('submit', handleIDCardGeneration);
            }

            // Form controls
            const resetFormBtn = document.getElementById('resetForm');
            if (resetFormBtn) {
                resetFormBtn.addEventListener('click', resetIDCardForm);
            }

            // Download buttons
            const downloadJPG = document.getElementById('downloadJPG');
            const printCard = document.getElementById('printCard');

            if (downloadJPG) downloadJPG.addEventListener('click', downloadIDCardAsJPG);
            if (printCard) printCard.addEventListener('click', printIDCard);

            // Modal controls
            const closeQuizModal = document.getElementById('closeQuizModal');
            const closeResultModal = document.getElementById('closeResultModal');

            if (closeQuizModal) closeQuizModal.addEventListener('click', () => closeModal('quizModal'));
            if (closeResultModal) closeResultModal.addEventListener('click', () => closeModal('resultModal'));

            // Quiz navigation
            const prevQuestionBtn = document.getElementById('prevQuestion');
            const nextQuestionBtn = document.getElementById('nextQuestion');
            const submitQuizBtn = document.getElementById('submitQuiz');

            if (prevQuestionBtn) prevQuestionBtn.addEventListener('click', previousQuestion);
            if (nextQuestionBtn) nextQuestionBtn.addEventListener('click', nextQuestion);
            if (submitQuizBtn) submitQuizBtn.addEventListener('click', submitQuizAnswers);

            // Result actions
            const retakeQuiz = document.getElementById('retakeQuiz');
            const shareResult = document.getElementById('shareResult');

            if (retakeQuiz) retakeQuiz.addEventListener('click', retakeCurrentQuiz);
            if (shareResult) shareResult.addEventListener('click', shareQuizResult);
        }

        function setupNavigation() {
            const sections = document.querySelectorAll('section[id]');
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        document.querySelectorAll('.nav-link').forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }, observerOptions);

            sections.forEach(section => {
                observer.observe(section);
            });
        }

        function initializePhotoUpload() {
            const photoInput = document.getElementById('photo');
            const photoPreview = document.getElementById('photoPreview');

            if (photoInput && photoPreview) {
                photoPreview.addEventListener('click', () => {
                    photoInput.click();
                });

                photoInput.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file && file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            photoPreview.innerHTML = `<img src="${e.target.result}" alt="Photo Preview">`;
                            photoPreview.style.background = 'none';
                            photoPreview.style.border = '2px solid var(--primary-color)';
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
        }

        function handleIDCardGeneration(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const formData = {
                cardType: document.getElementById('cardType').value,
                template: document.getElementById('template').value,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                rollNumber: document.getElementById('rollNumber').value,
                department: document.getElementById('department').value,
                semester: document.getElementById('semester').value,
                batch: document.getElementById('batch').value,
                bloodGroup: document.getElementById('bloodGroup').value,
                phone: document.getElementById('phone').value,
                photo: document.querySelector('#photoPreview img')?.src || null
            };

            generateIDCard(formData);
        }

        function generateIDCard(data) {
    const idCardDisplay = document.getElementById('idCardDisplay');

    const headerText = data.cardType === 'student' ? 'STUDENT IDENTITY CARD' :
                    data.cardType === 'faculty' ? 'FACULTY IDENTITY CARD' :
                    data.cardType === 'staff' ? 'STAFF IDENTITY CARD' :
                    data.cardType === 'research' ? 'RESEARCH SCHOLAR CARD' :
                    data.cardType === 'phd' ? 'PHD SCHOLAR CARD' :
                    data.cardType === 'visitor' ? 'VISITOR PASS' :
                    data.cardType === 'alumni' ? 'ALUMNI CARD' :
                    data.cardType === 'guest' ? 'GUEST FACULTY CARD' : 'IDENTITY CARD';

    const templateHTML = `
        <div style="
            width:100%; height:100%;
            background: linear-gradient(160deg, #1a237e 0%, #283593 40%, #1565c0 100%);
            border-radius:14px;
            border: 3px solid #FFD700;
            display:flex; flex-direction:column;
            font-family: 'Segoe UI', sans-serif;
            overflow:hidden; position:relative;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        ">
            <!-- TOP HEADER STRIP -->
            <div style="
                background: linear-gradient(90deg, #FFD700, #FFA000);
                padding: 6px 15px;
                display:flex; align-items:center; justify-content:space-between;
            ">
                <div style="display:flex; align-items:center; gap:8px;">
                    <img src="https://img.jagranjosh.com/images/2022/June/362022/logo%20%2823%29.png"
                        style="width:28px; height:28px; border-radius:50%; border:1px solid #1a237e;"
                        onerror="this.style.display='none'">
                    <div>
                        <div style="font-size:9px; font-weight:800; color:#1a237e; letter-spacing:0.5px; line-height:1.2;">
                            NALANDA INSTITUTE OF TECHNOLOGY
                        </div>
                        <div style="font-size:7px; font-weight:600; color:#1a237e; letter-spacing:0.3px;">
                            BHUBANESWAR, ODISHA
                        </div>
                    </div>
                </div>
                <div style="font-size:8px; font-weight:800; color:#1a237e; letter-spacing:1px;">
                    ${headerText}
                </div>
            </div>

            <!-- MAIN BODY -->
            <div style="
                display:flex; flex:1; padding:12px 15px; gap:14px; align-items:flex-start;
            ">
                <!-- LEFT: PHOTO -->
                <div style="
                    flex-shrink:0;
                    display:flex; flex-direction:column; align-items:center; gap:6px;
                ">
                    <div style="
                        width:85px; height:100px;
                        border: 3px solid #FFD700;
                        border-radius:8px;
                        background: rgba(255,255,255,0.15);
                        overflow:hidden;
                        display:flex; align-items:center; justify-content:center;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                    ">
                        ${data.photo
                            ? `<img src="${data.photo}" style="width:100%; height:100%; object-fit:cover;">`
                            : `<svg width="40" height="40" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)">
                                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                               </svg>`
                        }
                    </div>
                    <div style="
                        background: rgba(255,215,0,0.2);
                        border: 1px solid #FFD700;
                        border-radius:4px;
                        padding: 2px 8px;
                        font-size:8px; font-weight:700; color:#FFD700; letter-spacing:0.5px;
                    ">
                        ${data.bloodGroup || 'N/A'}
                    </div>
                </div>

                <!-- RIGHT: INFO -->
                <div style="flex:1; display:flex; flex-direction:column; gap:5px;">
                    <div style="
                        font-size:16px; font-weight:800; color:#FFD700;
                        letter-spacing:0.5px; line-height:1.2;
                        border-bottom: 1px solid rgba(255,215,0,0.3);
                        padding-bottom:5px; margin-bottom:3px;
                        text-transform:uppercase;
                    ">
                        ${data.firstName} ${data.lastName}
                    </div>

                    ${[
                        { icon: '🪪', label: 'ID NO', value: data.rollNumber },
                        { icon: '🏛️', label: 'DEPT', value: data.department },
                        data.cardType === 'student' ? { icon: '📚', label: 'SEM', value: data.semester || 'N/A' } : null,
                        data.cardType === 'student' ? { icon: '🎓', label: 'BATCH', value: data.batch || 'N/A' } : null,
                        { icon: '📞', label: 'PHONE', value: data.phone || 'N/A' },
                    ].filter(Boolean).map(row => `
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span style="font-size:9px; min-width:42px; color:#FFD700; font-weight:700; letter-spacing:0.3px;">
                                ${row.label}:
                            </span>
                            <span style="font-size:10px; color:#FFFFFF; font-weight:600;">
                                ${row.value}
                            </span>
                        </div>
                    `).join('')}
                </div>

                <!-- NIT Badge top-right -->
                <div style="
                    position:absolute; top:40px; right:12px;
                    width:32px; height:32px;
                    background:#FFFFFF; border-radius:50%;
                    display:flex; align-items:center; justify-content:center;
                    font-size:8px; font-weight:800; color:#1a237e;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                ">NIT</div>
            </div>

            <!-- BOTTOM STRIP -->
            <div style="
                background: linear-gradient(90deg, #FFD700, #FFA000);
                padding: 4px 15px;
                display:flex; justify-content:space-between; align-items:center;
            ">
                <span style="font-size:8px; font-weight:700; color:#1a237e;">
                    Valid: Academic Year 2024-25
                </span>
                <span style="font-size:8px; font-weight:700; color:#1a237e;">
                    www.nitbbsr.ac.in
                </span>
            </div>
        </div>
    `;

    idCardDisplay.innerHTML = templateHTML;
    idCardDisplay.style.height = 'auto';
    idCardDisplay.style.minHeight = '260px';
    idCardDisplay.style.background = 'none';
    idCardDisplay.style.border = 'none';
    idCardDisplay.style.borderRadius = '0';
    idCardDisplay.style.padding = '0';

    document.getElementById('downloadJPG').disabled = false;
    document.getElementById('printCard').disabled = false;
    currentIDCardData = data;

    // AUTO SAVE TO MONGODB
    (async function() {
        try {
            var tok  = sessionStorage.getItem('nit_token');
            var user = JSON.parse(sessionStorage.getItem('nit_user') || '{}');
            var res  = await fetch('/api/cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + tok
                },
                body: JSON.stringify({
                    cardType:    data.cardType   || 'student',
                    name:        (data.firstName || '') + ' ' + (data.lastName || ''),
                    firstName:   data.firstName  || '',
                    lastName:    data.lastName   || '',
                    rollNumber:  data.rollNumber || '',
                    department:  data.department || '',
                    semester:    data.semester   || '',
                    batch:       data.batch      || '',
                    bloodGroup:  data.bloodGroup || '',
                    phone:       data.phone      || '',
                    template:    data.template   || '',
                    email:       user.email      || '',
                    generatedBy: user.email      || 'unknown',
                    status:      'active'
                })
            });
            var result = await res.json();
            if (result.success) {
                console.log('Card saved! No:', result.cardNumber);
                if (typeof showSaveToast === 'function') {
                    showSaveToast('Card saved! No: ' + result.cardNumber, 'ok');
                }
            } else {
                console.error('Save failed:', result.error);
                if (typeof showSaveToast === 'function') {
                    showSaveToast('Save failed: ' + (result.error || 'Error'), 'err');
                }
            }
        } catch(e) {
            console.error('MongoDB save error:', e);
        }
    })();
}

        function resetIDCardForm() {
            document.getElementById('idCardForm').reset();
            document.getElementById('photoPreview').innerHTML = '<i class="fas fa-camera"></i><span>Upload Photo</span>';
            document.getElementById('photoPreview').style.background = '';
            document.getElementById('photoPreview').style.border = '';
            
            // Disable download buttons
            document.getElementById('downloadJPG').disabled = true;
            document.getElementById('printCard').disabled = true;
        }

        function downloadIDCardAsJPG() {
    if (!currentIDCardData) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 600;

    function drawCard() {
        // Background gradient
        const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        bg.addColorStop(0, '#1a237e');
        bg.addColorStop(0.4, '#283593');
        bg.addColorStop(1, '#1565c0');
        ctx.fillStyle = bg;
        roundRect(ctx, 0, 0, canvas.width, canvas.height, 20);
        ctx.fill();

        // Gold border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 6;
        roundRect(ctx, 3, 3, canvas.width - 6, canvas.height - 6, 18);
        ctx.stroke();

        // TOP HEADER STRIP
        const headerGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        headerGrad.addColorStop(0, '#FFD700');
        headerGrad.addColorStop(1, '#FFA000');
        ctx.fillStyle = headerGrad;
        roundRect(ctx, 3, 3, canvas.width - 6, 65, { tl: 18, tr: 18, bl: 0, br: 0 });
        ctx.fill();

        // Institute name in header
        ctx.fillStyle = '#1a237e';
        ctx.font = 'bold 18px Arial';
        ctx.fillText('NALANDA INSTITUTE OF TECHNOLOGY, BHUBANESWAR', 20, 30);
        ctx.font = 'bold 14px Arial';
        ctx.fillText('STUDENT IDENTITY CARD', 20, 52);

        // NIT badge
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(canvas.width - 45, 34, 22, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#1a237e';
        ctx.font = 'bold 12px Arial';
        ctx.fillText('NIT', canvas.width - 57, 39);

        // PHOTO BOX
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        roundRect(ctx, 30, 90, 170, 210, 10);
        ctx.fill();
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        roundRect(ctx, 30, 90, 170, 210, 10);
        ctx.stroke();

        // INFO TEXT
        const infoX = 230;
        let infoY = 120;

        // Name
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 28px Arial';
        ctx.fillText(`${currentIDCardData.firstName} ${currentIDCardData.lastName}`, infoX, infoY);
        infoY += 10;

        // Divider
        ctx.strokeStyle = 'rgba(255,215,0,0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(infoX, infoY + 5);
        ctx.lineTo(canvas.width - 30, infoY + 5);
        ctx.stroke();
        infoY += 25;

        const fields = [
            { label: 'ID NO', value: currentIDCardData.rollNumber },
            { label: 'DEPT', value: currentIDCardData.department },
            { label: 'SEM', value: currentIDCardData.semester || 'N/A' },
            { label: 'BATCH', value: currentIDCardData.batch || 'N/A' },
            { label: 'BLOOD', value: currentIDCardData.bloodGroup || 'N/A' },
            { label: 'PHONE', value: currentIDCardData.phone || 'N/A' },
        ];

        fields.forEach(field => {
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(`${field.label}:`, infoX, infoY);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '16px Arial';
            ctx.fillText(field.value, infoX + 100, infoY);
            infoY += 32;
        });

        // BOTTOM STRIP
        const footerGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        footerGrad.addColorStop(0, '#FFD700');
        footerGrad.addColorStop(1, '#FFA000');
        ctx.fillStyle = footerGrad;
        roundRect(ctx, 3, canvas.height - 45, canvas.width - 6, 42, { tl: 0, tr: 0, bl: 18, br: 18 });
        ctx.fill();

        ctx.fillStyle = '#1a237e';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Valid: Academic Year 2024-25', 20, canvas.height - 18);
        ctx.fillText('www.nitbbsr.ac.in', canvas.width - 200, canvas.height - 18);
    }

    function roundRect(ctx, x, y, w, h, r) {
        if (typeof r === 'number') r = { tl: r, tr: r, bl: r, br: r };
        ctx.beginPath();
        ctx.moveTo(x + r.tl, y);
        ctx.lineTo(x + w - r.tr, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
        ctx.lineTo(x + w, y + h - r.br);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
        ctx.lineTo(x + r.bl, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
        ctx.lineTo(x, y + r.tl);
        ctx.quadraticCurveTo(x, y, x + r.tl, y);
        ctx.closePath();
    }

    if (currentIDCardData.photo) {
        const img = new Image();
        img.onload = function () {
            drawCard();
            // Clip photo into box
            ctx.save();
            roundRect(ctx, 32, 92, 166, 206, 8);
            ctx.clip();
            ctx.drawImage(img, 32, 92, 166, 206);
            ctx.restore();
            downloadCanvas(canvas);
        };
        img.onerror = function() {
            drawCard();
            downloadCanvas(canvas);
        };
        img.src = currentIDCardData.photo;
    } else {
        drawCard();
        downloadCanvas(canvas);
    }
}

function downloadCanvas(canvas) {
    canvas.toBlob(function (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentIDCardData.rollNumber}_id_card.jpg`;
        a.click();
        URL.revokeObjectURL(url);
    }, 'image/jpeg', 0.95);
}

        function printIDCard() {
            if (!currentIDCardData) return;
            
            const printWindow = window.open('', '_blank');
            const idCardHTML = document.getElementById('idCardDisplay').innerHTML;
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>ID Card - ${currentIDCardData.firstName} ${currentIDCardData.lastName}</title>
                    <style>
                        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                        .id-card-content { max-width: 600px; margin: 0 auto; }
                        .id-card-content img { max-width: 100px; height: auto; }
                    </style>
                </head>
                <body>
                    ${idCardHTML}
                </body>
                </html>
            `);
            
            printWindow.document.close();
            printWindow.print();
        }

        // Quiz Functions
        function startQuiz(category) {
            currentQuizCategory = category;
            currentQuestion = 0;
            userAnswers = [];
            
            if (!quizData[category] || !quizData[category].questions) {
                alert('Quiz data not available for this category');
                return;
            }
            
            openQuizModal(category);
            startQuizTimer();
            loadQuestion();
        }

        function openQuizModal(category) {
            const modal = document.getElementById('quizModal');
            const title = document.getElementById('quizTitle');
            
            title.textContent = quizData[category].title;
            modal.classList.add('active');
            
            // Reset navigation
            document.getElementById('prevQuestion').disabled = true;
            document.getElementById('nextQuestion').disabled = false;
            document.getElementById('submitQuiz').style.display = 'none';
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.remove('active');
            
            if (modalId === 'quizModal') {
                stopQuizTimer();
            }
        }

        function startQuizTimer() {
            quizStartTime = Date.now();
            let seconds = 0;
            
            quizTimer = setInterval(() => {
                seconds++;
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                
                const timerDisplay = document.getElementById('quizTimer');
                if (timerDisplay) {
                    timerDisplay.innerHTML = `<i class="fas fa-clock"></i> ${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
                }
            }, 1000);
        }

        function stopQuizTimer() {
            if (quizTimer) {
                clearInterval(quizTimer);
                quizTimer = null;
            }
        }

        function loadQuestion() {
            const questions = quizData[currentQuizCategory].questions;
            const question = questions[currentQuestion];
            
            const questionContainer = document.getElementById('questionContainer');
            const progressDisplay = document.getElementById('quizProgress');
            
            questionContainer.innerHTML = `
                <div class="question">
                    Question ${currentQuestion + 1}: ${question.question}
                </div>
                <div class="options">
                    ${question.options.map((option, index) => `
                        <div class="option ${userAnswers[currentQuestion] === index ? 'selected' : ''}" data-index="${index}">
                            <input type="radio" name="answer" value="${index}" ${userAnswers[currentQuestion] === index ? 'checked' : ''}>
                            <label>${option}</label>
                        </div>
                    `).join('')}
                </div>
            `;
            
            progressDisplay.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
            
            // Add event listeners to options
            const options = questionContainer.querySelectorAll('.option');
            options.forEach(option => {
                option.addEventListener('click', function() {
                    selectOption(parseInt(this.getAttribute('data-index')));
                });
            });
            
            // Update navigation buttons
            updateNavigationButtons();
        }

        function selectOption(index) {
            userAnswers[currentQuestion] = index;
            
            // Update UI
            const options = document.querySelectorAll('.option');
            options.forEach(option => {
                option.classList.remove('selected');
                if (parseInt(option.getAttribute('data-index')) === index) {
                    option.classList.add('selected');
                    option.querySelector('input').checked = true;
                }
            });
        }

        function updateNavigationButtons() {
            const questions = quizData[currentQuizCategory].questions;
            const prevBtn = document.getElementById('prevQuestion');
            const nextBtn = document.getElementById('nextQuestion');
            const submitBtn = document.getElementById('submitQuiz');
            
            prevBtn.disabled = currentQuestion === 0;
            
            if (currentQuestion === questions.length - 1) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'block';
            } else {
                nextBtn.style.display = 'block';
                submitBtn.style.display = 'none';
            }
        }

        function previousQuestion() {
            if (currentQuestion > 0) {
                currentQuestion--;
                loadQuestion();
            }
        }

        function nextQuestion() {
            if (userAnswers[currentQuestion] === undefined) {
                alert("Please select an option!");
                return;
            }

            const questions = quizData[currentQuizCategory].questions;

            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                loadQuestion();
            }
        }
        function submitQuizAnswers() {
            stopQuizTimer();
            
            const questions = quizData[currentQuizCategory].questions;
            let correctAnswers = 0;
            
            questions.forEach((question, index) => {
                if (userAnswers[index] === question.correct) {
                    correctAnswers++;
                }
            });
            
            const score = Math.round((correctAnswers / questions.length) * 100);
            const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
            
            showResults(score, correctAnswers, questions.length - correctAnswers, timeTaken);
        }

        function showResults(score, correct, wrong, timeTaken) {
            const modal = document.getElementById('resultModal');
            
            document.getElementById('scorePercentage').textContent = `${score}%`;
            document.getElementById('totalQuestions').textContent = correct + wrong;
            document.getElementById('correctAnswers').textContent = correct;
            document.getElementById('wrongAnswers').textContent = wrong;
            document.getElementById('timeTaken').textContent = formatTime(timeTaken);
            
            modal.classList.add('active');
            closeModal('quizModal');
        }

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        function retakeCurrentQuiz() {
            closeModal('resultModal');
            startQuiz(currentQuizCategory);
        }

        function shareQuizResult() {
            const score = document.getElementById('scorePercentage').textContent;
            const category = currentQuizCategory;
            
            const shareText = `I scored ${score} in the ${category} quiz on NIT Bhubaneswar platform!`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Quiz Result',
                    text: shareText,
                    url: window.location.href
                });
            } else {
                // Fallback
                navigator.clipboard.writeText(shareText);
                alert('Result copied to clipboard!');
            }
        }

        // Library Functions
        function searchLibrary() {
            const searchTerm = document.getElementById('librarySearch').value;
            const searchType = document.getElementById('searchType').value;
            
            if (!searchTerm.trim()) {
                alert('Please enter a search term');
                return;
            }
            
            // Simulate library search
            const results = [
                { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', type: 'book', available: true },
                { title: 'Computer Networks', author: 'Andrew S. Tanenbaum', type: 'book', available: true },
                { title: 'Journal of Computer Science', author: 'Various', type: 'journal', available: false },
                { title: 'Digital Signal Processing', author: 'John G. Proakis', type: 'ebook', available: true }
            ];
            
            const filteredResults = results.filter(item => 
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            alert(`Found ${filteredResults.length} results for "${searchTerm}" in ${searchType}:\n\n` +
                filteredResults.map(item => `${item.title} by ${item.author} (${item.available ? 'Available' : 'Not Available'})`).join('\n'));
        }

        // Placement Functions
        function applyForDrive(companyName) {
            const studentName = prompt('Enter your name:');
            const rollNumber = prompt('Enter your roll number:');
            const email = prompt('Enter your email:');
            
            if (studentName && rollNumber && email) {
                alert(`Application submitted successfully!\n\nCompany: ${companyName}\nName: ${studentName}\nRoll Number: ${rollNumber}\nEmail: ${email}\n\nYou will receive further details via email.`);
            } else {
                alert('Please fill all required fields');
            }
        }

        // Library Service Functions
        function accessEBooks() {
            alert('E-Books Portal: Access thousands of digital books and journals 24/7.\n\nLogin with your institute credentials to access the digital library.');
        }

        function browseCatalog() {
            alert('Digital Library Catalog: Browse our extensive collection of books, journals, and research papers.\n\nFeatures:\n- Advanced search\n- Category browsing\n- Online reservations\n- Citation management');
        }

        function reserveBook() {
            const bookTitle = prompt('Enter book title to reserve:');
            const rollNumber = prompt('Enter your roll number:');
            
            if (bookTitle && rollNumber) {
                alert(`Book reservation submitted!\n\nBook: ${bookTitle}\nRoll Number: ${rollNumber}\n\nYou will be notified when the book is available.`);
            }
        }

        function bookStudyRoom() {
            const roomType = prompt('Select room type (Group/Individual):');
            const date = prompt('Enter date (DD/MM/YYYY):');
            const time = prompt('Enter time slot (HH:MM - HH:MM):');
            
            if (roomType && date && time) {
                alert(`Study room booking confirmed!\n\nRoom Type: ${roomType}\nDate: ${date}\nTime: ${time}\n\nPlease collect the key from the library reception.`);
            }
        }

        // Placement Service Functions
        function buildResume() {
            alert('Resume Builder: Create professional resumes with our AI-powered tool.\n\nFeatures:\n- Multiple templates\n- AI suggestions\n- Export to PDF\n- ATS-friendly format');
        }

        function scheduleInterview() {
            const interviewType = prompt('Select interview type (Technical/HR):');
            const date = prompt('Enter preferred date (DD/MM/YYYY):');
            const time = prompt('Enter preferred time (HH:MM):');
            
            if (interviewType && date && time) {
                alert(`Mock interview scheduled!\n\nType: ${interviewType}\nDate: ${date}\nTime: ${time}\n\nYou will receive confirmation via email.`);
            }
        }

        function viewPrograms() {
            alert('Training Programs: Enhance your skills with our comprehensive training programs.\n\nAvailable Programs:\n- Technical Skills Development\n- Soft Skills Training\n- Aptitude Preparation\n- Interview Skills\n- Industry-specific Training');
        }

        function bookCareerSession() {
            const sessionType = prompt('Select session type (Career Planning/Resume Review/Interview Prep):');
            const date = prompt('Enter preferred date (DD/MM/YYYY):');
            
            if (sessionType && date) {
                alert(`Career counseling session booked!\n\nSession Type: ${sessionType}\nDate: ${date}\n\nYou will receive confirmation details via email.`);
            }
        }

        // Add event listeners for library and placement buttons
        document.addEventListener('DOMContentLoaded', function() {
            // Library service buttons
            const libraryButtons = document.querySelectorAll('.library-services .btn-primary');
            libraryButtons.forEach((button, index) => {
                button.addEventListener('click', function() {
                    switch(index) {
                        case 0: accessEBooks(); break;
                        case 1: browseCatalog(); break;
                        case 2: reserveBook(); break;
                        case 3: bookStudyRoom(); break;
                    }
                });
            });

            // Placement service buttons
            const placementButtons = document.querySelectorAll('.placement-services .btn-primary');
            placementButtons.forEach((button, index) => {
                button.addEventListener('click', function() {
                    switch(index) {
                        case 0: buildResume(); break;
                        case 1: scheduleInterview(); break;
                        case 2: viewPrograms(); break;
                        case 3: bookCareerSession(); break;
                    }
                });
            });

            // Placement drive apply buttons
            const driveButtons = document.querySelectorAll('.drive-card .btn-primary');
            driveButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const companyName = this.closest('.drive-card').querySelector('h4').textContent;
                    applyForDrive(companyName);
                });
            });

            // Library search form
            const librarySearchForm = document.querySelector('.search-form');
            if (librarySearchForm) {
                librarySearchForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    searchLibrary();
                });
            }
        });

        // Alumni Functions
        function registerAlumni() {
            const name = prompt('Enter your full name:');
            const batch = prompt('Enter your batch year:');
            const branch = prompt('Enter your branch/department:');
            const email = prompt('Enter your email:');
            const phone = prompt('Enter your phone number:');
            
            if (name && batch && branch && email) {
                alert(`Alumni registration successful!\n\nName: ${name}\nBatch: ${batch}\nBranch: ${branch}\nEmail: ${email}\nPhone: ${phone}\n\nWelcome to NIT Bhubaneswar Alumni Association!`);
            } else {
                alert('Please fill all required fields');
            }
        }

        function browseAlumniDirectory() {
            alert('Alumni Directory: Search and connect with fellow alumni.\n\nFeatures:\n- Search by name, batch, branch\n- Filter by location, company\n- Send connection requests\n- Professional networking');
        }

        function viewAlumniEvents() {
            alert('Upcoming Alumni Events:\n\n1. Annual Alumni Meet - 15th May 2024\n2. Tech Summit 2024 - 20th June 2024\n3. Homecoming Weekend - 10th August 2024\n4. Alumni Awards Night - 25th December 2024\n\nRegister now to attend!');
        }

        function donateToNIT() {
            const amount = prompt('Enter donation amount (INR):');
            const purpose = prompt('Select purpose (Infrastructure/Scholarship/Research):');
            
            if (amount && purpose) {
                alert(`Thank you for your donation!\n\nAmount: INR ${amount}\nPurpose: ${purpose}\n\nYou will receive a receipt and donation certificate.`);
            }
        }

        function joinLinkedInGroup() {
            alert('LinkedIn Alumni Group: Join our official NIT Bhubaneswar alumni network.\n\nBenefits:\n- Professional networking\n- Job opportunities\n- Industry updates\n- Alumni discussions\n\nGroup: NIT Bhubaneswar Alumni Association');
        }

        function subscribeNewsletter() {
            const email = prompt('Enter your email to subscribe:');
            if (email) {
                alert(`Newsletter subscription successful!\n\nEmail: ${email}\n\nYou will receive monthly alumni newsletters with updates, events, and opportunities.`);
            }
        }

        function becomeMentor() {
            const expertise = prompt('Enter your area of expertise:');
            const availability = prompt('Enter your availability (hours/week):');
            
            if (expertise && availability) {
                alert(`Mentorship registration successful!\n\nExpertise: ${expertise}\nAvailability: ${availability} hours/week\n\nThank you for giving back to the community!`);
            }
        }

        // Research Functions
        function exploreResearchProjects(area) {
            const projects = {
                'Artificial Intelligence': [
                    'Deep Learning for Healthcare',
                    'Computer Vision Applications',
                    'Natural Language Processing',
                    'Robotics and Automation'
                ],
                'VLSI & Embedded Systems': [
                    'Low Power VLSI Design',
                    'IoT Sensor Networks',
                    'Embedded Security Systems',
                    'ASIC Design Methodology'
                ],
                'Wireless Communications': [
                    '5G Network Optimization',
                    'MIMO Systems',
                    'Wireless Sensor Networks',
                    'Satellite Communications'
                ],
                'Environmental Engineering': [
                    'Solar Energy Systems',
                    'Water Treatment Technologies',
                    'Air Pollution Control',
                    'Sustainable Materials'
                ]
            };
            
            const areaProjects = projects[area] || [];
            alert(`Research Projects in ${area}:\n\n` + areaProjects.map((project, index) => `${index + 1}. ${project}`).join('\n'));
        }

        function viewResearchPaper(title) {
            alert(`Research Paper: ${title}\n\nAbstract: This paper presents groundbreaking research in the field...\n\nFull paper available in:\n- IEEE Xplore Digital Library\n- Google Scholar\n- ResearchGate\n- Institute Digital Repository`);
        }

        function visitResearchLab(labName) {
            alert(`Research Lab: ${labName}\n\nFacilities:\n- Advanced computing systems\n- Specialized equipment\n- Research software\n- Student workstations\n\nVisiting Hours: 9:00 AM - 6:00 PM\nContact: lab.coordinator@nitbbsr.ac.in`);
        }

        // NIRF Functions
        function viewNIRFDetails() {
            alert('NIRF Rankings 2024:\n\nOverall: #42 (Up 5 from 2023)\nEngineering: #38 (Up 8 from 2023)\nResearch: #65 (Up 12 from 2023)\n\nTotal Score: 77.4/100\nImprovement: +12.5% over last year');
        }

        function downloadNIRFCertificate() {
            alert('NIRF Certificate Download:\n\nCertificate of Excellence\nNalanda Institutional Ranking Framework 2024\n\nRank: #42 (Overall)\nCategory: Engineering Institutions\n\nDownload available at: www.nirf.in.gov.in');
        }

        // Enhanced Contact Functions
        function initiateLiveChat() {
            const name = prompt('Enter your name:');
            const email = prompt('Enter your email:');
            
            if (name && email) {
                alert(`Live chat session initiated!\n\nName: ${name}\nEmail: ${email}\n\nA support representative will join the chat shortly.\nTypical wait time: 2-5 minutes`);
            }
        }

        function scheduleVideoCall() {
            const date = prompt('Select date (DD/MM/YYYY):');
            const time = prompt('Select time (HH:MM):');
            const department = prompt('Select department (Admission/Academic/Administrative):');
            
            if (date && time && department) {
                alert(`Video call scheduled!\n\nDate: ${date}\nTime: ${time}\nDepartment: ${department}\n\nMeeting link will be sent to your email.\nDuration: 30 minutes`);
            }
        }

        function trackSupportTicket() {
            const ticketId = prompt('Enter your ticket ID:');
            if (ticketId) {
                alert(`Ticket Status: ${ticketId}\n\nStatus: In Progress\nAssigned to: Support Team\nLast Updated: 2 hours ago\nExpected Resolution: Within 24 hours`);
            }
        }

        function requestCampusTour() {
            const date = prompt('Select preferred date (DD/MM/YYYY):');
            const time = prompt('Select time slot (9 AM/11 AM/2 PM/4 PM):');
            const visitors = prompt('Number of visitors:');
            
            if (date && time && visitors) {
                alert(`Campus tour request submitted!\n\nDate: ${date}\nTime: ${time}\nVisitors: ${visitors}\n\nConfirmation will be sent via email.\nPlease arrive 15 minutes early.`);
            }
        }

        function downloadBrochure() {
            alert('Institute Brochure Download:\n\nAvailable Formats:\n- PDF (High Quality)\n- Interactive PDF\n- Mobile Version\n\nBrochure includes:\n- Academic programs\n- Campus facilities\n- Admission process\n- Fee structure\n- Placement statistics');
        }

        // Contact Form Functions
        function handleContactForm(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                category: document.getElementById('category').value,
                message: document.getElementById('message').value
            };
            
            if (!formData.name || !formData.email || !formData.subject || !formData.category || !formData.message) {
                alert('Please fill all required fields');
                return;
            }
            
            // Simulate form submission
            alert(`Contact form submitted successfully!\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nSubject: ${formData.subject}\nCategory: ${formData.category}\n\nWe will respond to your inquiry within 24-48 hours.\n\nReference ID: #${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
            
            // Reset form
            document.getElementById('contactForm').reset();
        }

        function resetContactForm() {
            document.getElementById('contactForm').reset();
        }

        // Add event listeners for alumni, research, NIRF, and contact buttons
        document.addEventListener('DOMContentLoaded', function() {
            // Alumni service buttons
            const alumniButtons = document.querySelectorAll('.alumni-services .btn-primary');
            alumniButtons.forEach((button, index) => {
                button.addEventListener('click', function() {
                    switch(index) {
                        case 0: registerAlumni(); break;
                        case 1: browseAlumniDirectory(); break;
                        case 2: viewAlumniEvents(); break;
                        case 3: donateToNIT(); break;
                    }
                });
            });

            // Alumni networking buttons
            const networkingButtons = document.querySelectorAll('.networking-grid .btn-primary');
            networkingButtons.forEach((button, index) => {
                button.addEventListener('click', function() {
                    switch(index) {
                        case 0: joinLinkedInGroup(); break;
                        case 1: subscribeNewsletter(); break;
                        case 2: becomeMentor(); break;
                    }
                });
            });

            // Research area buttons
            const areaButtons = document.querySelectorAll('.areas-grid .btn-primary');
            areaButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const area = this.closest('.area-card').querySelector('h4').textContent;
                    exploreResearchProjects(area);
                });
            });

            // Publication buttons
            const pubButtons = document.querySelectorAll('.publication-card .btn-primary');
            pubButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const title = this.closest('.publication-card').querySelector('h4').textContent;
                    viewResearchPaper(title);
                });
            });

            // Lab buttons
            const labButtons = document.querySelectorAll('.labs-grid .btn-primary');
            labButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const labName = this.closest('.lab-card').querySelector('h4').textContent;
                    visitResearchLab(labName);
                });
            });

            // Contact form event listeners
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', handleContactForm);
            }

            const resetContactFormBtn = document.getElementById('resetContactForm');
            if (resetContactFormBtn) {
                resetContactFormBtn.addEventListener('click', resetContactForm);
            }

            // Enhanced contact buttons
            const contactButtons = document.querySelectorAll('.contact-actions .btn-primary');
            contactButtons.forEach((button, index) => {
                button.addEventListener('click', function() {
                    switch(index) {
                        case 0: initiateLiveChat(); break;
                        case 1: scheduleVideoCall(); break;
                        case 2: trackSupportTicket(); break;
                        case 3: requestCampusTour(); break;
                        case 4: downloadBrochure(); break;
                    }
                });
            });
        });

        // Add Font Awesome for icons
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(fontAwesome);