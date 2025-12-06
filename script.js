// ===================== STUDENT PORTAL APPLICATION =====================
const StudentPortal = {
  charts: [],
  profileData: {
    name: 'Afifah Imanina Binti Azhar',
    studentId: '2025179485',
    email: '2025179485@student.uitm.edu.my',
    phone: '011-57694035',
    dob: '2004-09-16',
    gender: 'Female',
    nationality: 'Malaysian',
    ic: '040916-14-1234',
    program: 'CDIM262 - Information System Management',
    faculty: 'Faculty of Information Management',
    semester: 'Semester 4 (Year 2)',
    enrollment: 'September 2025',
    campus: 'UITM Shah Alam',
    address: 'No. 123, Jalan UITM, 40450 Shah Alam, Selangor',
    cgpa: '3.52',
    attendance: '92%',
    courses: '8',
    creditsCompleted: '64',
    currentCredits: '22',
    standing: 'Dean\'s List'
  },
  
  // ===================== INITIALIZATION =====================
  init() {
    this.setupTheme();
    this.setupNavigation();
    this.setupLogin();
    
    // Only run page-specific functions if elements exist
    if (document.getElementById('profilePic')) {
      this.setupProfile();
    }
    
    if (document.querySelector('table')) {
      this.setupTables();
    }
    
    if (document.getElementById('timetableContainer')) {
      this.setupTimetable();
    }
    
    if (document.querySelector('.chart-container')) {
      this.setupCharts();
    }
    
    this.showWelcome();
    this.setupProfileForm();
    this.updateActivityTimeline();
  },

  // ===================== THEME MANAGEMENT =====================
  setupTheme() {
    const themeToggles = document.querySelectorAll('#themeToggle, .theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    
    themeToggles.forEach(toggle => {
      this.updateThemeIcon(toggle, savedTheme);
      toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update all theme toggles
        document.querySelectorAll('#themeToggle, .theme-toggle').forEach(t => {
          this.updateThemeIcon(t, newTheme);
        });
        
        this.showToast(`Switched to ${newTheme} mode`, 'info');
        this.updateChartsForTheme(newTheme);
      });
    });
  },

  updateThemeIcon(element, theme) {
    if (element) {
      element.innerHTML = theme === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
      element.className = theme === 'dark' ? 'btn btn-outline-warning ms-2' : 'btn btn-outline-dark ms-2';
    }
  },

  updateChartsForTheme(theme) {
    if (!this.charts || this.charts.length === 0) return;
    const isDarkMode = theme === 'dark';
    const textColor = isDarkMode ? '#f8f9fa' : '#212529';
    const gridColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    
    this.charts.forEach(chart => {
      if (chart.options.scales) {
        if (chart.options.scales.x) {
          chart.options.scales.x.ticks.color = textColor;
          chart.options.scales.x.grid.color = gridColor;
        }
        if (chart.options.scales.y) {
          chart.options.scales.y.ticks.color = textColor;
          chart.options.scales.y.grid.color = gridColor;
        }
      }
      
      if (chart.options.plugins?.legend) {
        chart.options.plugins.legend.labels.color = textColor;
      }
      
      if (chart.options.plugins?.tooltip) {
        chart.options.plugins.tooltip.backgroundColor = isDarkMode ? '#2d2d2d' : '#ffffff';
        chart.options.plugins.tooltip.titleColor = textColor;
        chart.options.plugins.tooltip.bodyColor = textColor;
        chart.options.plugins.tooltip.borderColor = isDarkMode ? '#404040' : '#e0e0e0';
      }
      
      chart.update('none');
    });
  },

// ===================== NAVIGATION =====================
setupNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkHref = link.getAttribute('href');
        link.classList.toggle('active', linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html'));
    });
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('studentId');
            localStorage.removeItem('name');
            localStorage.removeItem('profileImage');
            this.showToast('Logged out successfully', 'success');
            setTimeout(() => window.location.href = 'login.html', 1500);
        });
    }
},

  // ===================== LOGIN =====================
  setupLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const studentId = document.getElementById('studentId').value;
        const password = document.getElementById('password').value;
        
        if (studentId && password) {
          localStorage.setItem('studentId', studentId);
          localStorage.setItem('name', 'Afifah Imanina');
          this.showToast('Login successful!', 'success');
          setTimeout(() => window.location.href = 'index.html', 1000);
        } else {
          this.showToast('Please enter student ID and password', 'error');
        }
      });
    }
  },

  // ===================== PROFILE =====================
  setupProfile() {
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
      this.profileData = { ...this.profileData, ...JSON.parse(savedProfile) };
    }
    this.loadProfileImage();
    this.updateProfileDisplay();
  },

  loadProfileImage() {
    const savedImage = localStorage.getItem('profileImage');
    const profilePic = document.getElementById('profilePic');
    if (profilePic && savedImage) {
      profilePic.src = savedImage;
    }
  },

  updateProfileDisplay() {
    const fields = [
      { id: 'displayName', key: 'name' },
      { id: 'studentIdDisplay', key: 'studentId' },
      { id: 'profileStudentId', key: 'studentId' },
      { id: 'profileName', key: 'name' },
      { id: 'editName', key: 'name' },
      { id: 'displayEmail', key: 'email' },
      { id: 'editEmail', key: 'email' },
      { id: 'displayPhone', key: 'phone' },
      { id: 'editPhone', key: 'phone' },
      { id: 'displayDob', key: 'dob' },
      { id: 'editDob', key: 'dob' },
      { id: 'displayGender', key: 'gender' },
      { id: 'displayNationality', key: 'nationality' },
      { id: 'displayIC', key: 'ic' },
      { id: 'displayProgram', key: 'program' },
      { id: 'displayFaculty', key: 'faculty' },
      { id: 'displaySemester', key: 'semester' },
      { id: 'displayEnrollment', key: 'enrollment' },
      { id: 'displayCampus', key: 'campus' },
      { id: 'displayAddress', key: 'address' },
      { id: 'editAddress', key: 'address' }
    ];
    
    fields.forEach(field => {
      const element = document.getElementById(field.id);
      if (element) {
        if (field.id.includes('edit')) {
          element.value = this.profileData[field.key];
        } else {
          element.textContent = this.profileData[field.key];
        }
      }
    });
    
    this.updateProfileStats();
  },

  updateProfileStats() {
    const stats = [
      { selector: '.stat-card:nth-child(1) .stat-value', key: 'cgpa' },
      { selector: '.stat-card:nth-child(2) .stat-value', key: 'courses' },
      { selector: '.stat-card:nth-child(3) .stat-value', key: 'attendance' },
      { selector: '.stat-card:nth-child(4) .stat-value', key: 'creditsCompleted' },
      { selector: '.stat-card:nth-child(5) .stat-value', key: 'currentCredits' },
      { selector: '.stat-card:nth-child(6) .stat-value', key: 'standing' }
    ];
    
    stats.forEach(stat => {
      const element = document.querySelector(stat.selector);
      if (element) {
        element.textContent = this.profileData[stat.key];
      }
    });
  },

  setupProfileImageUpload() {
    const profilePic = document.getElementById('profilePic');
    const profileUpload = document.getElementById('profileUpload');
    
    if (profilePic && profileUpload) {
      profilePic.addEventListener('click', () => profileUpload.click());
      profileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) this.handleProfileImage(file);
      });
    }
  },

  handleProfileImage(file) {
    if (file.size > 5 * 1024 * 1024) {
      return this.showToast('Image size should be less than 5MB', 'error');
    }
    
    if (!file.type.startsWith('image/')) {
      return this.showToast('Please select an image file', 'error');
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const profilePic = document.getElementById('profilePic');
      if (profilePic) {
        profilePic.src = event.target.result;
        localStorage.setItem('profileImage', event.target.result);
        this.showToast('Profile picture updated!', 'success');
        profilePic.classList.add('profile-updated');
        setTimeout(() => profilePic.classList.remove('profile-updated'), 500);
        this.addActivity('Updated profile picture');
      }
    };
    reader.readAsDataURL(file);
  },

  addActivity(activityText) {
    const activityLog = localStorage.getItem('profileActivities') || '[]';
    const activities = JSON.parse(activityLog);
    
    activities.unshift({
      text: activityText,
      time: new Date().toISOString(),
      timestamp: Date.now()
    });
    
    if (activities.length > 10) activities.pop();
    
    localStorage.setItem('profileActivities', JSON.stringify(activities));
    this.updateActivityTimeline();
  },

  updateActivityTimeline() {
    const timelineContainer = document.querySelector('.activity-timeline');
    if (!timelineContainer) return;
    
    const activityLog = localStorage.getItem('profileActivities') || '[]';
    let activities = JSON.parse(activityLog);
    
    if (activities.length === 0) {
      activities = [
        { text: 'Profile created', time: new Date(Date.now() - 86400000 * 2).toISOString(), timestamp: Date.now() - 86400000 * 2 },
        { text: 'Updated contact information', time: new Date(Date.now() - 86400000).toISOString(), timestamp: Date.now() - 86400000 },
        { text: 'Completed assignment for IMS566', time: new Date().toISOString(), timestamp: Date.now() }
      ];
      localStorage.setItem('profileActivities', JSON.stringify(activities));
    }
    
    timelineContainer.innerHTML = '';
    activities.forEach(activity => {
      const time = new Date(activity.time);
      const timeStr = this.formatActivityTime(time);
      const activityItem = document.createElement('div');
      activityItem.className = 'activity-item';
      activityItem.innerHTML = `
        <div class="activity-time">${timeStr}</div>
        <div class="activity-text">${activity.text}</div>
      `;
      timelineContainer.appendChild(activityItem);
    });
  },

  formatActivityTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  setupProfileForm() {
    const saveBtn = document.getElementById('saveProfileBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveProfileChanges());
    }
    
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.saveProfileChanges();
        }
      });
    }
  },

  saveProfileChanges() {
    const updatedData = {
      name: document.getElementById('editName')?.value || this.profileData.name,
      email: document.getElementById('editEmail')?.value || this.profileData.email,
      phone: document.getElementById('editPhone')?.value || this.profileData.phone,
      dob: document.getElementById('editDob')?.value || this.profileData.dob,
      address: document.getElementById('editAddress')?.value || this.profileData.address
    };
    
    this.profileData = { ...this.profileData, ...updatedData };
    localStorage.setItem('profileData', JSON.stringify(this.profileData));
    
    this.updateProfileDisplay();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
    if (modal) modal.hide();
    
    this.showToast('Profile updated successfully!', 'success');
    
    const name = localStorage.getItem('name');
    if (name) {
      localStorage.setItem('name', updatedData.name.split(' ')[0]);
    }
  },

  // ===================== CHARTS =====================
  setupCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded yet, retrying in 500ms');
      setTimeout(() => this.setupCharts(), 500);
      return;
    }
    
    const isDarkMode = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    const textColor = isDarkMode ? '#f8f9fa' : '#212529';
    const gridColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const tooltipBg = isDarkMode ? '#2d2d2d' : '#ffffff';

    // Attendance Chart
    const attendanceCtx = document.getElementById('attendanceChart');
    if (attendanceCtx) {
      try {
        const attendanceChart = new Chart(attendanceCtx, {
          type: 'doughnut',
          data: {
            labels: ['Present (85%)', 'Absent (10%)', 'Late (5%)'],
            datasets: [{
              data: [85, 10, 5],
              backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
              borderWidth: 1,
              borderColor: isDarkMode ? '#2d2d2d' : '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: textColor,
                  font: {
                    size: 12,
                    family: "'Poppins', sans-serif"
                  },
                  padding: 15
                }
              },
              tooltip: {
                backgroundColor: tooltipBg,
                titleColor: textColor,
                bodyColor: textColor,
                borderColor: isDarkMode ? '#404040' : '#e0e0e0',
                borderWidth: 1
              }
            }
          }
        });
        this.charts.push(attendanceChart);
      } catch (error) {
        console.error('Error creating attendance chart:', error);
        this.showFallbackChart(attendanceCtx, 'Attendance data unavailable');
      }
    }

    // CGPA Chart
    const cgpaCtx = document.getElementById('cgpaChart');
    if (cgpaCtx) {
      try {
        const cgpaChart = new Chart(cgpaCtx, {
          type: 'line',
          data: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
            datasets: [{
              label: 'CGPA',
              data: [3.2, 3.4, 3.5, 3.52],
              borderColor: '#004080',
              backgroundColor: isDarkMode ? 'rgba(0, 64, 128, 0.2)' : 'rgba(0, 64, 128, 0.1)',
              fill: true,
              tension: 0.4,
              borderWidth: 3,
              pointBackgroundColor: '#004080',
              pointBorderColor: isDarkMode ? '#2d2d2d' : '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                min: 0,
                max: 4.0,
                grid: { color: gridColor },
                ticks: {
                  color: textColor,
                  font: {
                    size: 11,
                    family: "'Poppins', sans-serif"
                  },
                  callback: v => v.toFixed(1)
                }
              },
              x: {
                grid: { color: gridColor },
                ticks: {
                  color: textColor,
                  font: {
                    size: 11,
                    family: "'Poppins', sans-serif"
                  }
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: textColor,
                  font: {
                    size: 12,
                    family: "'Poppins', sans-serif"
                  }
                }
              },
              tooltip: {
                backgroundColor: tooltipBg,
                titleColor: textColor,
                bodyColor: textColor,
                borderColor: isDarkMode ? '#404040' : '#e0e0e0',
                borderWidth: 1
              }
            }
          }
        });
        this.charts.push(cgpaChart);
      } catch (error) {
        console.error('Error creating CGPA chart:', error);
        this.showFallbackChart(cgpaCtx, 'CGPA data unavailable');
      }
    }

    // Course Chart
    const courseCtx = document.getElementById('courseChart');
    if (courseCtx) {
      try {
        const courseChart = new Chart(courseCtx, {
          type: 'bar',
          data: {
            labels: ['CTU552', 'IMC501', 'IMS511', 'IMS555'],
            datasets: [{
              label: 'Completion %',
              data: [100, 85, 90, 75],
              backgroundColor: '#004080',
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                grid: { color: gridColor },
                ticks: {
                  color: textColor,
                  font: {
                    size: 11,
                    family: "'Poppins', sans-serif"
                  },
                  callback: v => v + '%'
                }
              },
              x: {
                grid: { color: gridColor },
                ticks: {
                  color: textColor,
                  font: {
                    size: 11,
                    family: "'Poppins', sans-serif"
                  }
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: textColor,
                  font: {
                    size: 12,
                    family: "'Poppins', sans-serif"
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: c => c.dataset.label + ': ' + c.parsed.y + '%'
                },
                backgroundColor: tooltipBg,
                titleColor: textColor,
                bodyColor: textColor,
                borderColor: isDarkMode ? '#404040' : '#e0e0e0',
                borderWidth: 1
              }
            }
          }
        });
        this.charts.push(courseChart);
      } catch (error) {
        console.error('Error creating course chart:', error);
        this.showFallbackChart(courseCtx, 'Course data unavailable');
      }
    }

    // Course Progress Chart
    const courseProgressCtx = document.getElementById('courseProgressChart');
    if (courseProgressCtx) {
      try {
        const courseProgressChart = new Chart(courseProgressCtx, {
          type: 'bar',
          data: {
            labels: ['IMS560', 'IMS561', 'IMS566', 'IMS564', 'IMS565', 'LCC501', 'TAC451', 'CTU554'],
            datasets: [{
              label: 'Progress %',
              data: [95, 85, 65, 90, 80, 100, 95, 85],
              backgroundColor: '#004080',
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                grid: { color: gridColor },
                ticks: {
                  color: textColor,
                  font: {
                    size: 11,
                    family: "'Poppins', sans-serif"
                  },
                  callback: v => v + '%'
                }
              },
              x: {
                grid: { color: gridColor },
                ticks: {
                  color: textColor,
                  font: {
                    size: 10,
                    family: "'Poppins', sans-serif"
                  }
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: textColor,
                  font: {
                    size: 12,
                    family: "'Poppins', sans-serif"
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: c => c.dataset.label + ': ' + c.parsed.y + '%'
                },
                backgroundColor: tooltipBg,
                titleColor: textColor,
                bodyColor: textColor,
                borderColor: isDarkMode ? '#404040' : '#e0e0e0',
                borderWidth: 1
              }
            }
          }
        });
        this.charts.push(courseProgressChart);
      } catch (error) {
        console.error('Error creating course progress chart:', error);
        this.showFallbackChart(courseProgressCtx, 'Progress data unavailable');
      }
    }

    // GPA History Chart
    const gpaHistoryCtx = document.getElementById('gpaHistoryChart');
    if (gpaHistoryCtx) {
      try {
        const gpaHistoryChart = new Chart(gpaHistoryCtx, {
          type: 'line',
          data: {
            labels: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5'],
            datasets: [{
              label: 'CGPA',
              data: [3.2, 3.4, 3.5, 3.52, 3.6],
              borderColor: '#004080',
              backgroundColor: isDarkMode ? 'rgba(0, 64, 128, 0.2)' : 'rgba(0, 64, 128, 0.1)',
              fill: true,
              tension: 0.4,
              borderWidth: 3,
              pointBackgroundColor: '#004080',
              pointBorderColor: isDarkMode ? '#2d2d2d' : '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                min: 0,
                max: 4.0,
                grid: { color: gridColor },
                ticks: {
                  color: textColor,
                  font: {
                    size: 11,
                    family: "'Poppins', sans-serif"
                  },
                  callback: v => v.toFixed(1)
                }
              },
              x: {
                grid: { color: gridColor },
                ticks: {
                  color: textColor,
                  font: {
                    size: 11,
                    family: "'Poppins', sans-serif"
                  }
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: textColor,
                  font: {
                    size: 12,
                    family: "'Poppins', sans-serif"
                  }
                }
              },
              tooltip: {
                backgroundColor: tooltipBg,
                titleColor: textColor,
                bodyColor: textColor,
                borderColor: isDarkMode ? '#404040' : '#e0e0e0',
                borderWidth: 1,
                callbacks: {
                  label: c => 'CGPA: ' + c.parsed.y.toFixed(2)
                }
              }
            }
          }
        });
        this.charts.push(gpaHistoryChart);
      } catch (error) {
        console.error('Error creating GPA history chart:', error);
        this.showFallbackChart(gpaHistoryCtx, 'GPA history unavailable');
      }
    }
    
    console.log('Charts initialized:', this.charts.length);
  },

  showFallbackChart(canvasElement, message) {
    if (!canvasElement) return;
    
    const ctx = canvasElement.getContext('2d');
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    ctx.fillStyle = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? '#f8f9fa' : '#212529';
    ctx.font = '14px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText(message, canvasElement.width / 2, canvasElement.height / 2);
  },

  // ===================== TABLES =====================
  
  setupTables() {
    const courses = [
      { code: 'IMS560', name: 'Advanced Database Management System', credits: 3, color: 'course-1', grade: 'A' },
      { code: 'IMS561', name: 'Web Publishing', credits: 3, color: 'course-2', grade: 'B+' },
      { code: 'IMS566', name: 'Advanced Web Design Development', credits: 4, color: 'course-3', grade: 'A-' },
      { code: 'IMS564', name: 'User Experience Design', credits: 3, color: 'course-4', grade: 'A' },
      { code: 'IMS565', name: 'Information System Project Management', credits: 3, color: 'course-5', grade: 'B+' },
      { code: 'LCC501', name: 'English for Professional Correspondence', credits: 2, color: 'course-6', grade: 'A' },
      { code: 'TAC451', name: 'Introductory Arabic II', credits: 2, color: 'course-7', grade: 'A-' },
      { code: 'CTU554', name: 'Values and Civilization II', credits: 2, color: 'course-8', grade: 'A' }
    ];
    
    const coursesTable = document.getElementById('coursesTable');
    if (coursesTable) {
      const tbody = coursesTable.querySelector('tbody');
      if (tbody) {
        tbody.innerHTML = '';
        courses.forEach(course => {
          const gradeClass = course.grade.replace('+', 'plus').replace('-', 'minus');
          const row = document.createElement('tr');
          row.innerHTML = `
            <td><strong>${course.code}</strong></td>
            <td><span class="course-badge bg-${course.color}">${course.name}</span></td>
            <td>${course.credits}</td>
            <td><span class="grade-badge grade-${gradeClass}">${course.grade}</span></td>
            <td><span class="badge bg-success">Registered</span></td>
            <td><button class="btn btn-sm btn-outline-primary"><i class="bi bi-eye"></i></button></td>
          `;
          tbody.appendChild(row);
        });
      }
    }

    const grades = [
      { course: 'CTU552', name: 'Values and Civilization I', grade: 'A', credits: 2, points: 4.0 },
      { course: 'IMC501', name: 'Information and Media', grade: 'B+', credits: 3, points: 3.33 },
      { course: 'IMS511', name: 'Web Design & Development', grade: 'A-', credits: 3, points: 3.67 },
      { course: 'IMS555', name: 'Systems Analysis & Design', grade: 'B+', credits: 3, points: 3.33 },
      { course: 'IMS560', name: 'Advanced Database', grade: 'A', credits: 3, points: 4.0 },
      { course: 'IMS566', name: 'Advanced Web Design', grade: 'A-', credits: 4, points: 3.67 },
      { course: 'LCC501', name: 'English Correspondence', grade: 'A', credits: 2, points: 4.0 },
      { course: 'TAC451', name: 'Introductory Arabic II', grade: 'A-', credits: 2, points: 3.67 }
    ];
    
    const gradesTable = document.getElementById('gradesTable');
    if (gradesTable) {
      const tbody = gradesTable.querySelector('tbody');
      if (tbody) {
        tbody.innerHTML = '';
        let totalCredits = 0;
        let totalPoints = 0;
        
        grades.forEach(grade => {
          totalCredits += grade.credits;
          totalPoints += grade.points * grade.credits;
          const gradeClass = grade.grade.replace('+', 'plus').replace('-', 'minus');
          const row = document.createElement('tr');
          row.innerHTML = `
            <td><strong>${grade.course}</strong></td>
            <td>${grade.name}</td>
            <td><span class="grade-badge grade-${gradeClass}">${grade.grade}</span></td>
            <td>${grade.credits}</td>
            <td>${grade.points.toFixed(2)}</td>
          `;
          tbody.appendChild(row);
        });
        
        const gpa = (totalPoints / totalCredits).toFixed(2);
        const gpaElement = document.getElementById('currentGPA');
        if (gpaElement) gpaElement.textContent = gpa;
        
        const creditsElement = document.getElementById('totalCredits');
        if (creditsElement) creditsElement.textContent = totalCredits;
      }
    }
  },

  // ===================== TIMETABLE =====================
  setupTimetable() {
    const timetableData = {
      Monday: [
        { time: '8:00 AM - 11:00 AM', course: 'IMS564 - User Experience Design', room: 'Lab 6', type: 'lab' },
        { time: '11:00 AM - 2:00 PM', course: 'IMS560 - Advanced Database', room: 'MK1', type: 'lecture' },
        { time: '2:30 PM - 5:00 PM', course: 'IMS565 - Project Management', room: 'Seminar Room', type: 'lecture' }
      ],
      Tuesday: [
        { time: '2:00 PM - 6:00 PM', course: 'IMS566 - Web Development', room: 'MK6', type: 'lab' }
      ],
      Wednesday: [
        { time: '8:00 AM - 10:00 AM', course: 'LCC501 - English', room: 'MK1', type: 'lecture' },
        { time: '10:00 AM - 12:00 PM', course: 'TAC451 - Arabic', room: 'BK60', type: 'lecture' },
        { time: '4:00 PM - 6:00 PM', course: 'CTU554 - Values', room: 'Seminar 1', type: 'lecture' }
      ],
      Thursday: [
        { time: '2:00 PM - 5:00 PM', course: 'IMS561 - Web Publishing', room: 'MK7', type: 'lab' }
      ],
      Friday: [
        { time: '9:00 AM - 12:00 PM', course: 'Consultation Hours', room: 'Faculty Office', type: 'consultation' }
      ]
    };
    
    const timetableContainer = document.getElementById('timetableContainer');
    if (timetableContainer) {
      timetableContainer.innerHTML = '';
      
      Object.entries(timetableData).forEach(([day, classes]) => {
        const dayElement = document.createElement('div');
        dayElement.className = 'timetable-day';
        dayElement.innerHTML = `
          <h5 class="mb-3"><i class="bi bi-calendar-day me-2"></i>${day}</h5>
          ${classes.map(cls => `
            <div class="timetable-class ${cls.type}">
              <div class="class-time">${cls.time}</div>
              <div class="fw-bold">${cls.course}</div>
              <div class="class-info">
                <i class="bi bi-geo-alt me-1"></i>${cls.room}
                <span class="ms-2">
                  <i class="bi bi-${cls.type === 'lab' ? 'cpu' : 'person-standing'} me-1"></i>
                  ${cls.type.charAt(0).toUpperCase() + cls.type.slice(1)}
                </span>
              </div>
            </div>
          `).join('')}
        `;
        timetableContainer.appendChild(dayElement);
      });
      
      this.markCurrentClass();
      this.setupWeekNavigation();
    }
  },

  markCurrentClass() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();
    
    const dayMap = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday' };
    const currentDayName = dayMap[currentDay];
    
    if (currentDayName) {
      document.querySelectorAll('.timetable-day h5').forEach(dayHeader => {
        if (dayHeader.textContent.includes(currentDayName)) {
          dayHeader.parentElement.querySelectorAll('.timetable-class').forEach(cls => {
            const timeText = cls.querySelector('.class-time').textContent;
            const [startTime, endTime] = timeText.split(' - ');
            const startHour = this.parseTime(startTime);
            const endHour = this.parseTime(endTime);
            
            if (currentHour >= startHour && currentHour <= endHour) {
              cls.classList.add('current');
            }
          });
        }
      });
    }
  },

  parseTime(timeStr) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return hours;
  },

setupWeekNavigation() {
    // Check if already initialized
    if (this.weekNavigationInitialized) return;
    this.weekNavigationInitialized = true;
    
    document.querySelectorAll('.week-buttons .btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all buttons
            document.querySelectorAll('.week-buttons .btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Add active to clicked button
            btn.classList.add('active');
            
            // Get week number
            const weekText = btn.textContent;
            const weekNumber = weekText.includes('Week') ? weekText.match(/\d+/)?.[0] : 'current';
            
            // Update timetable for selected week
            this.loadTimetableForWeek(weekNumber);
            this.showToast(`Loaded timetable for ${weekText}`, 'info');
        });
    });
},

  loadTimetableForWeek(weekNumber) {
    const timetableContainer = document.getElementById('timetableContainer');
    if (!timetableContainer) return;
    
    // Add loading indicator
    timetableContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Loading timetable for Week ${weekNumber}...</p>
      </div>
    `;
    
    // Simulate API delay
    setTimeout(() => {
      this.setupTimetable();
      
      // Update current week display if available
      const weekDisplay = document.querySelector('.marquee-item:nth-child(1)');
      if (weekDisplay) {
        weekDisplay.innerHTML = `<i class="bi bi-clock"></i> Current Week: Week ${weekNumber} of Semester 4 2025/2026`;
      }
    }, 500);
  },

  // ===================== TIMETABLE UTILITIES =====================
  downloadTimetable() {
    const timetableData = {
      week: "Week 6",
      semester: "Semester 4 2025/2026",
      lastUpdated: new Date().toISOString(),
      schedule: {
        Monday: [
          { time: '8:00 AM - 11:00 AM', course: 'IMS564 - User Experience Design', room: 'Lab 6', type: 'lab' },
          { time: '11:00 AM - 2:00 PM', course: 'IMS560 - Advanced Database', room: 'MK1', type: 'lecture' },
          { time: '2:30 PM - 5:00 PM', course: 'IMS565 - Project Management', room: 'Seminar Room', type: 'lecture' }
        ],
        Tuesday: [
          { time: '2:00 PM - 6:00 PM', course: 'IMS566 - Web Development', room: 'MK6', type: 'lab' }
        ],
        Wednesday: [
          { time: '8:00 AM - 10:00 AM', course: 'LCC501 - English', room: 'MK1', type: 'lecture' },
          { time: '10:00 AM - 12:00 PM', course: 'TAC451 - Arabic', room: 'BK60', type: 'lecture' },
          { time: '4:00 PM - 6:00 PM', course: 'CTU554 - Values', room: 'Seminar 1', type: 'lecture' }
        ],
        Thursday: [
          { time: '2:00 PM - 5:00 PM', course: 'IMS561 - Web Publishing', room: 'MK7', type: 'lab' }
        ],
        Friday: [
          { time: '9:00 AM - 12:00 PM', course: 'Consultation Hours', room: 'Faculty Office', type: 'consultation' }
        ]
      }
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(timetableData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `timetable_week${timetableData.week}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    
    this.showToast('Timetable downloaded as JSON!', 'success');
  },

  printPage() {
    // Store current theme
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    
    // Switch to light mode for printing
    document.documentElement.setAttribute('data-bs-theme', 'light');
    
    // Add print styles
    const printStyles = `
      @media print {
        .navbar, .marquee-container, footer, .btn,
        .card-header, .card-body .btn-group,
        .timetable-controls, .profile-actions {
          display: none !important;
        }
        body {
          padding-top: 0 !important;
        }
        .card {
          border: 1px solid #ddd !important;
          box-shadow: none !important;
        }
        .page-header {
          background: #004080 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .timetable-day {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      }
    `;
    
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = printStyles;
    document.head.appendChild(styleSheet);
    
    // Print
    window.print();
    
    // Clean up
    setTimeout(() => {
      document.head.removeChild(styleSheet);
      document.documentElement.setAttribute('data-bs-theme', currentTheme);
      this.showToast('Timetable printed!', 'success');
    }, 100);
  },

  // ===================== UTILITIES =====================
  showToast(message, type = 'info') {
    const toastId = 'toast-' + Date.now();
    const isDarkMode = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    const toastBodyClass = isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark';
    
    const toastHtml = `
      <div id="${toastId}" class="toast fade show" role="alert">
        <div class="toast-header bg-${type} text-white border-0">
          <i class="bi ${this.getToastIcon(type)} me-2"></i>
          <strong class="me-auto">${this.getToastTitle(type)}</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body ${toastBodyClass}">${message}</div>
      </div>
    `;
    
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container position-fixed top-0 end-0 p-3';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
    }
    
    container.insertAdjacentHTML('afterbegin', toastHtml);
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  },

  getToastIcon(type) {
    const icons = {
      success: 'bi-check-circle-fill',
      error: 'bi-x-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill'
    };
    return icons[type] || 'bi-info-circle-fill';
  },

  getToastTitle(type) {
    const titles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information'
    };
    return titles[type] || 'Notification';
  },

  showWelcome() {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
      setTimeout(() => {
        const name = localStorage.getItem('name') || 'Student';
        this.showToast(`Welcome back, ${name}!`, 'success');
      }, 1000);
    }
    
    if (window.location.pathname.includes('profile.html')) {
      setTimeout(() => {
        const name = localStorage.getItem('name') || 'Student';
        this.showToast(`Welcome to your profile, ${name}!`, 'info');
      }, 1500);
    }
  }
};

// ===================== INITIALIZATION =====================
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => StudentPortal.init(), 100);
});

// ===================== LOGIN REDIRECTION =====================
if (!window.location.pathname.includes('login.html')) {
  const studentId = localStorage.getItem('studentId');
  if (!studentId) {
    const toastHtml = `
      <div class="toast show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
        <div class="toast-header bg-warning text-dark">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          <strong class="me-auto">Authentication Required</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">Please login to access this page. Redirecting to login...</div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', toastHtml);
    setTimeout(() => window.location.href = 'login.html', 2000);
  }
}

if (window.location.pathname.includes('login.html')) {
  const studentId = localStorage.getItem('studentId');
  if (studentId) {
    const toastHtml = `
      <div class="toast show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
        <div class="toast-header bg-info text-white">
          <i class="bi bi-info-circle-fill me-2"></i>
          <strong class="me-auto">Already Logged In</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">You're already logged in. Redirecting to dashboard...</div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', toastHtml);
    setTimeout(() => window.location.href = 'index.html', 1500);
  }
}

// ===================== GLOBAL UTILITIES =====================
window.printPage = () => StudentPortal.printPage();
window.downloadTimetable = () => StudentPortal.downloadTimetable();
window.StudentPortal = StudentPortal;

window.viewDocuments = () => StudentPortal.showToast('Opening documents...', 'info');
window.privacySettings = () => StudentPortal.showToast('Opening privacy settings...', 'info');

window.printProfile = () => {
  const currentTheme = document.documentElement.getAttribute('data-bs-theme');
  document.documentElement.setAttribute('data-bs-theme', 'light');
  
  const printStyles = `
    @media print {
      .navbar, .marquee-container, .profile-actions, .btn,
      .modal, .toast-container, footer {
        display: none !important;
      }
      body {
        padding-top: 0 !important;
        background: white !important;
        color: black !important;
      }
      .card {
        border: 1px solid #ddd !important;
        box-shadow: none !important;
      }
      .profile-header {
        background: linear-gradient(135deg, #004080, #002855) !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .stat-card {
        border: 1px solid #ddd !important;
      }
    }
  `;
  
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = printStyles;
  document.head.appendChild(styleSheet);
  
  window.print();
  
  document.head.removeChild(styleSheet);
  document.documentElement.setAttribute('data-bs-theme', currentTheme);
  StudentPortal.showToast('Profile sent to printer', 'success');
};

window.downloadProfileAsPDF = () => {
  StudentPortal.showToast('Generating PDF...', 'info');
  setTimeout(() => StudentPortal.showToast('Profile downloaded as PDF!', 'success'), 2000);
};

window.shareProfile = () => {
  if (navigator.share) {
    navigator.share({
      title: 'My UITM Student Profile',
      text: 'Check out my UITM student profile',
      url: window.location.href
    })
    .then(() => StudentPortal.showToast('Profile shared successfully!', 'success'))
    .catch(() => StudentPortal.showToast('Sharing cancelled', 'info'));
  } else {
    navigator.clipboard.writeText(window.location.href)
      .then(() => StudentPortal.showToast('Profile link copied to clipboard!', 'success'))
      .catch(() => StudentPortal.showToast('Failed to copy link', 'error'));
  }
};

window.openPrivacySettings = () => StudentPortal.showToast('Opening privacy settings...', 'info');
window.downloadProfile = () => {
  StudentPortal.showToast('Preparing profile export...', 'info');
  setTimeout(() => StudentPortal.showToast('Profile exported successfully!', 'success'), 1500);
};

window.showQRCode = () => {
  StudentPortal.showToast('Generating QR code...', 'info');
  setTimeout(() => StudentPortal.showToast('QR code ready!', 'success'), 1000);
};

window.downloadQRCode = () => StudentPortal.showToast('QR Code downloaded!', 'success');
window.editPersonalInfo = () => {
  const editButton = document.getElementById('editProfileModal');
  if (editButton) editButton.click();
};
window.editSkills = () => StudentPortal.showToast('Opening skills editor...', 'info');
window.editEmergencyContact = () => StudentPortal.showToast('Editing emergency contact...', 'info');

console.log('Student Portal loaded successfully');