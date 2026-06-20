document.addEventListener('DOMContentLoaded', () => {
    const data = resumeData.fr;

    // Hook Section
    document.getElementById('hook-text').textContent = data.main_message;

    // Hero Section
    const aboutRaw = `Bonjour, je suis **${data.about_me.firstname} ${data.about_me.lastname}**.\n\n${data.about_me.whoami}`;
    document.getElementById('about-text').innerHTML = marked.parse(aboutRaw);

    // Study Section
    const studyTimeline = document.getElementById('study-timeline');
    data.academic_path.forEach(study => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        
        let dateStr = study.startDate.year;
        if (study.endDate) {
            dateStr += ` - ${study.endDate.year}`;
        }
        
        item.innerHTML = `
            <div class="timeline-date">${dateStr}</div>
            <div class="timeline-title">${study.degree}</div>
            <div class="timeline-subtitle">${study.school.name}, ${study.school.city}</div>
        `;
        studyTimeline.appendChild(item);
    });

    // Experience Section
    const expTimeline = document.getElementById('experience-timeline');
    data.professional_experiences.forEach(exp => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        
        let dateStr = exp.startDate.year;
        
        if (exp.endDate) {
            dateStr += ` - ${exp.endDate.year}`;
            if (exp.startDate.month && exp.endDate.month) {
                let months = (exp.endDate.year - exp.startDate.year) * 12 + (exp.endDate.month - exp.startDate.month);
                if (months > 0) {
                    dateStr += ` (${months} mois)`;
                }
            }
        } else {
            dateStr += ' - Présent';
            if (exp.startDate.month) {
                let currentDate = new Date();
                let months = (currentDate.getFullYear() - exp.startDate.year) * 12 + ((currentDate.getMonth() + 1) - exp.startDate.month);
                if (months > 0) {
                    dateStr += ` (${months} mois)`;
                }
            }
        }
        
        const techTags = exp.technologies ? exp.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('') : '';
        
        item.innerHTML = `
            <div class="timeline-date">${dateStr}</div>
            <div class="timeline-title">${exp.position} - ${exp.company}</div>
            <div class="timeline-subtitle">${exp.roleDescription}</div>
            <div class="timeline-tech">${techTags}</div>
        `;
        expTimeline.appendChild(item);
    });

    // Projects Section
    const projectsGrid = document.getElementById('projects-grid');
    data.projects.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        const techTags = proj.technologies ? proj.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('') : '';
        
        let titleHtml = proj.link ? `<a href="${proj.link}" target="_blank" style="color:inherit; text-decoration:none;">${proj.name} <i class="fas fa-external-link-alt" style="font-size:0.8em; margin-left:5px;"></i></a>` : proj.name;

        card.innerHTML = `
            <div class="project-title">${titleHtml}</div>
            <div class="project-desc">${proj.description}</div>
            <div class="timeline-tech">${techTags}</div>
        `;
        projectsGrid.appendChild(card);
    });

    // Contact Section
    const contactInfo = document.getElementById('contact-info');
    contactInfo.innerHTML = `
        <div class="contact-item">
            <i class="fas fa-envelope"></i>
            <a href="mailto:${data.contact_details.email}" style="color:var(--text-primary); text-decoration:none;">${data.contact_details.email}</a>
        </div>
        <div class="contact-item">
            <i class="fas fa-phone"></i>
            <a href="tel:${data.contact_details.phone}" style="color:var(--text-primary); text-decoration:none;">${data.contact_details.phone}</a>
        </div>
        <div class="contact-item">
            <i class="fab fa-github"></i>
            <a href="${data.contact_details.github}" target="_blank" style="color:var(--text-primary); text-decoration:none;">GitHub</a>
        </div>
        <div class="contact-item">
            <i class="fab fa-linkedin"></i>
            <a href="${data.contact_details.linkedin}" target="_blank" style="color:var(--text-primary); text-decoration:none;">LinkedIn</a>
        </div>
        <div class="contact-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>France</span>
        </div>
    `;

    // Mobile Navigation Drawer Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navLinksContainer = document.getElementById('nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('drawer-open');
            const icon = navToggle.querySelector('i');
            if (navLinksContainer.classList.contains('drawer-open')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Close drawer when a link is clicked
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('drawer-open');
                const icon = navToggle.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            });
        });

        // Close drawer when clicking outside
        document.addEventListener('click', (event) => {
            if (navLinksContainer.classList.contains('drawer-open')) {
                const isClickInsideMenu = navLinksContainer.contains(event.target);
                const isClickOnToggle = navToggle.contains(event.target);
                
                if (!isClickInsideMenu && !isClickOnToggle) {
                    navLinksContainer.classList.remove('drawer-open');
                    const icon = navToggle.querySelector('i');
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            }
        });
    }

    // Highlight active section in navigation
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-80px 0px 0px 0px', // Offset for the fixed navbar
        threshold: 0.3 // Trigger when 30% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to the corresponding link
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

});
