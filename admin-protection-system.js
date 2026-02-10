// ============================================
// 🔒 ملف: admin-protection-system.js
// 📁 يضاف كملف منفصل دون تعديل index.html
// ============================================

class AdminProtectionSystem {
    constructor() {
        this.systemOwnerId = "1111"; // ID المسؤول texn
        this.systemOwnerUsername = "texn";
        this.protectedUsers = ["1111", "texn"]; // لا يمكن المساس بهم
        this.adminActionsLog = [];
        this.setupProtection();
    }
    
    setupProtection() {
        // مراقبة نقرات الأدمن
        this.monitorAdminClicks();
        
        // حماية في الوقت الحقيقي
        this.realTimeProtection();
        
        console.log('🔒 نظام حماية الأدمن مفعل');
    }
    
    // مراقبة نقرات الأدمن على البروفايلات
    monitorAdminClicks() {
        // استبدال دالة عرض البروفايل الأصلية
        const originalShowUserProfile = window.showUserProfile;
        
        window.showUserProfile = async (userId) => {
            // إذا كان الأدمن يحاول عرض بروفايل المسؤول
            if (this.isSystemOwner(userId) && this.isAdminViewing()) {
                await this.showOwnerProtectionMessage();
                return; // إيقاف العملية
            }
            
            // استدعاء الدالة الأصلية للمستخدمين العاديين
            return originalShowUserProfile(userId);
        };
    }
    
    // حماية في الوقت الحقيقي
    realTimeProtection() {
        // استبدال دالة حظر المستخدم
        const originalBanUser = window.banUser;
        
        window.banUser = async (userId, reason, days) => {
            if (this.isProtectedUser(userId)) {
                await this.showProtectionAlert('حظر');
                return false;
            }
            return originalBanUser(userId, reason, days);
        };
        
        // استبدال دالة حذف المستخدم
        const originalDeleteUser = window.deleteUser;
        
        window.deleteUser = async (userId) => {
            if (this.isProtectedUser(userId)) {
                await this.showProtectionAlert('حذف');
                return false;
            }
            return originalDeleteUser(userId);
        };
        
        // استبدال دالة منح مميز
        const originalGrantPremium = window.grantPremium;
        
        window.grantPremium = async (userId, days) => {
            // منع الأدمن من منح مميز
            if (this.isAdminViewing() && !this.isSystemOwnerViewing()) {
                await this.showPremiumRestriction();
                return false;
            }
            return originalGrantPremium(userId, days);
        };
        
        // استبدال دالة منح أدمن
        const originalGrantAdmin = window.grantAdmin;
        
        window.grantAdmin = async (username) => {
            // فقط المسؤول يقدر يعطي أدمن
            if (!this.isSystemOwnerViewing()) {
                await this.showAdminGrantRestriction();
                return false;
            }
            return originalGrantAdmin(username);
        };
    }
    
    // التحقق إذا كان المستخدم مسؤول النظام
    isSystemOwner(userId) {
        return userId === this.systemOwnerId || 
               userId === this.systemOwnerUsername ||
               this.protectedUsers.includes(userId);
    }
    
    // التحقق إذا كان المستخدم محمي
    isProtectedUser(userId) {
        const protectedIds = [this.systemOwnerId, ...this.protectedUsers];
        return protectedIds.includes(userId);
    }
    
    // التحقق إذا كان الأدمن الحالي هو المشاهد
    isAdminViewing() {
        return window.currentUser && window.currentUser.isAdmin;
    }
    
    // التحقق إذا كان المسؤول الحالي هو المشاهد
    isSystemOwnerViewing() {
        return window.currentUser && 
               (window.currentUser.id === this.systemOwnerId || 
                window.currentUser.username === this.systemOwnerUsername);
    }
    
    // عرض رسالة حماية المسؤول
    async showOwnerProtectionMessage() {
        this.logAction('VIEW_OWNER_PROFILE', 'محاولة مشاهدة بروفايل المسؤول');
        
        // إنشاء نافذة تنبيه مخصصة
        const modalHTML = `
            <div id="owner-protection-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.85);
                backdrop-filter: blur(10px);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            ">
                <div style="
                    background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
                    border-radius: 20px;
                    padding: 30px;
                    max-width: 400px;
                    width: 90%;
                    border: 2px solid #ff4444;
                    box-shadow: 0 0 30px rgba(255, 68, 68, 0.3);
                    text-align: center;
                ">
                    <div style="
                        font-size: 60px;
                        color: #ff4444;
                        margin-bottom: 20px;
                    ">
                        👑
                    </div>
                    
                    <h2 style="
                        color: #ff4444;
                        margin-bottom: 15px;
                        font-family: 'Tajawal', sans-serif;
                    ">
                        مسؤول النظام
                    </h2>
                    
                    <p style="
                        color: rgba(255,255,255,0.8);
                        line-height: 1.6;
                        margin-bottom: 25px;
                        font-family: 'Tajawal', sans-serif;
                    ">
                        هذا الحساب هو <strong style="color: #ffd700;">مسؤول النظام الرئيسي</strong>.
                        <br><br>
                        ⚠️ <strong>لا يمكنك:</strong>
                        <br>• حظره أو تقييده
                        <br>• حذفه أو تعديله
                        <br>• منحه أي صلاحيات
                        <br>• أي إجراء ضده
                    </p>
                    
                    <div style="
                        background: rgba(255, 68, 68, 0.1);
                        padding: 15px;
                        border-radius: 10px;
                        margin: 20px 0;
                        border-left: 4px solid #ff4444;
                    ">
                        <p style="
                            color: rgba(255,255,255,0.7);
                            font-size: 14px;
                            font-family: 'Tajawal', sans-serif;
                        ">
                            أنت: <strong style="color: #00bcd4;">${window.currentUser?.displayName || 'أدمن'}</strong>
                            <br>
                            الصلاحيات: <strong style="color: #ff9800;">أدمن محدود</strong>
                        </p>
                    </div>
                    
                    <button onclick="document.getElementById('owner-protection-modal').remove()" style="
                        background: linear-gradient(135deg, #ff4444, #c62828);
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 10px;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                        font-family: 'Tajawal', sans-serif;
                        transition: 0.3s;
                        width: 100%;
                    " onmouseover="this.style.transform='scale(1.02)'" 
                     onmouseout="this.style.transform='scale(1)'">
                        فهمت 👍
                    </button>
                </div>
            </div>
            
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
            </style>
        `;
        
        // إضافة النافذة إلى body
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);
        
        // اهتزاز النافذة للتنبيه
        setTimeout(() => {
            const modal = document.getElementById('owner-protection-modal');
            if (modal) {
                modal.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    modal.style.animation = '';
                }, 500);
            }
        }, 100);
        
        return false;
    }
    
    // عرض تنبيه الحماية
    async showProtectionAlert(actionType) {
        this.logAction(`BLOCKED_${actionType.toUpperCase()}`, 'محاولة إجراء على مسؤول');
        
        const alertHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #ff4444, #c62828);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                z-index: 9998;
                animation: slideInRight 0.3s ease;
                border-left: 4px solid #ffd700;
                box-shadow: 0 5px 20px rgba(255, 68, 68, 0.3);
                font-family: 'Tajawal', sans-serif;
                max-width: 300px;
            ">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                    <div style="font-size: 20px;">🚫</div>
                    <strong style="font-size: 14px;">ممنوع</strong>
                </div>
                <p style="margin: 0; font-size: 12px; line-height: 1.4;">
                    لا يمكنك ${actionType} <strong style="color: #ffd700;">مسؤول النظام</strong>
                    <br>هذا الإجراء محمي بنظام الحماية
                </p>
            </div>
            
            <style>
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;
        
        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = alertHTML;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
        
        return false;
    }
    
    // عرض تقييد منح المميز
    async showPremiumRestriction() {
        this.logAction('BLOCKED_PREMIUM_GRANT', 'محاولة منح مميز');
        
        const modalHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.9);
                backdrop-filter: blur(10px);
                padding: 25px;
                border-radius: 15px;
                border: 2px solid #ff9800;
                z-index: 9997;
                max-width: 350px;
                width: 90%;
                text-align: center;
                font-family: 'Tajawal', sans-serif;
            ">
                <div style="font-size: 40px; color: #ff9800; margin-bottom: 15px;">
                    👑
                </div>
                <h3 style="color: #ff9800; margin-bottom: 10px;">صلاحية خاصة</h3>
                <p style="color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.5;">
                    خاصية <strong>منح الاشتراك المميز</strong> متاحة فقط لـ 
                    <strong style="color: #ffd700;">مسؤول النظام</strong>.
                    <br><br>
                    يمكنك فقط <strong>إدارة المستخدمين العاديين</strong>.
                </p>
                <button onclick="this.parentElement.remove()" style="
                    background: rgba(255, 152, 0, 0.2);
                    color: #ff9800;
                    border: 1px solid #ff9800;
                    padding: 10px 20px;
                    border-radius: 8px;
                    margin-top: 15px;
                    cursor: pointer;
                    font-family: 'Tajawal', sans-serif;
                ">
                    فهمت
                </button>
            </div>
        `;
        
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);
        
        setTimeout(() => modalDiv.remove(), 5000);
        
        return false;
    }
    
    // عرض تقييد منح الأدمن
    async showAdminGrantRestriction() {
        this.logAction('BLOCKED_ADMIN_GRANT', 'محاولة منح أدمن');
        
        const modalHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.9);
                backdrop-filter: blur(10px);
                padding: 25px;
                border-radius: 15px;
                border: 2px solid #9C27B0;
                z-index: 9997;
                max-width: 350px;
                width: 90%;
                text-align: center;
                font-family: 'Tajawal', sans-serif;
            ">
                <div style="font-size: 40px; color: #9C27B0; margin-bottom: 15px;">
                    🛡️
                </div>
                <h3 style="color: #9C27B0; margin-bottom: 10px;">صلاحية عليا</h3>
                <p style="color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.5;">
                    خاصية <strong>منح صلاحية أدمن</strong> متاحة فقط لـ 
                    <strong style="color: #ffd700;">مسؤول النظام الرئيسي (texn)</strong>.
                    <br><br>
                    هذه الصلاحية حصرية لحماية النظام من التخريب.
                </p>
                <button onclick="this.parentElement.remove()" style="
                    background: rgba(156, 39, 176, 0.2);
                    color: #9C27B0;
                    border: 1px solid #9C27B0;
                    padding: 10px 20px;
                    border-radius: 8px;
                    margin-top: 15px;
                    cursor: pointer;
                    font-family: 'Tajawal', sans-serif;
                ">
                    فهمت
                </button>
            </div>
        `;
        
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);
        
        setTimeout(() => modalDiv.remove(), 5000);
        
        return false;
    }
    
    // تسجيل الإجراءات
    logAction(action, details) {
        const logEntry = {
            timestamp: Date.now(),
            admin: window.currentUser?.username || 'unknown',
            action: action,
            details: details,
            ip: this.getClientIP()
        };
        
        this.adminActionsLog.push(logEntry);
        console.log('🔍 إجراء أدمن:', logEntry);
        
        // حفظ في localStorage للرؤية
        if (this.isSystemOwnerViewing()) {
            this.saveToLocalStorage(logEntry);
        }
    }
    
    getClientIP() {
        // محاكاة للحصول على IP (في تطبيق حقيقي نستخدم service)
        return 'IP-' + Math.random().toString(36).substr(2, 9);
    }
    
    saveToLocalStorage(logEntry) {
        let logs = JSON.parse(localStorage.getItem('admin_protection_logs') || '[]');
        logs.push(logEntry);
        localStorage.setItem('admin_protection_logs', JSON.stringify(logs.slice(-100))); // حفظ آخر 100 إجراء
    }
    
    // عرض سجلات الحماية للمسؤول
    showProtectionLogs() {
        if (!this.isSystemOwnerViewing()) return;
        
        const logs = JSON.parse(localStorage.getItem('admin_protection_logs') || '[]');
        
        const logsHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.95);
                backdrop-filter: blur(20px);
                padding: 20px;
                border-radius: 15px;
                border: 2px solid #00bcd4;
                z-index: 9999;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                font-family: 'Tajawal', sans-serif;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="color: #00bcd4; margin: 0;">📋 سجلات حماية النظام</h3>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 20px;
                        cursor: pointer;
                    ">×</button>
                </div>
                
                ${logs.length === 0 ? 
                    `<p style="color: rgba(255,255,255,0.5); text-align: center;">لا توجد سجلات حتى الآن</p>` : 
                    logs.reverse().map(log => `
                        <div style="
                            background: rgba(255,255,255,0.05);
                            padding: 10px;
                            border-radius: 8px;
                            margin-bottom: 10px;
                            border-left: 3px solid ${log.action.includes('BLOCKED') ? '#ff4444' : '#ff9800'};
                        ">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <strong style="color: #00bcd4; font-size: 12px;">${log.admin}</strong>
                                <span style="color: rgba(255,255,255,0.5); font-size: 11px;">
                                    ${new Date(log.timestamp).toLocaleString('ar-SA')}
                                </span>
                            </div>
                            <div style="color: rgba(255,255,255,0.8); font-size: 12px;">
                                ${log.action.replace(/_/g, ' ')}: ${log.details}
                            </div>
                            ${log.ip ? `<div style="color: rgba(255,255,255,0.4); font-size: 10px; margin-top: 5px;">${log.ip}</div>` : ''}
                        </div>
                    `).join('')
                }
                
                ${logs.length > 0 ? `
                    <button onclick="localStorage.removeItem('admin_protection_logs'); location.reload();" style="
                        background: rgba(255,68,68,0.2);
                        color: #ff4444;
                        border: 1px solid #ff4444;
                        padding: 8px 15px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-family: 'Tajawal', sans-serif;
                        margin-top: 10px;
                        width: 100%;
                    ">
                        🗑️ مسح جميع السجلات
                    </button>
                ` : ''}
            </div>
        `;
        
        const logsDiv = document.createElement('div');
        logsDiv.innerHTML = logsHTML;
        document.body.appendChild(logsDiv);
    }
}

// ============================================
// 🚀 تفعيل النظام تلقائياً
// ============================================

// انتظار تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.AdminProtection = new AdminProtectionSystem();
        }, 1000); // تأخير بسيط لضمان تحميل النظام
    });
} else {
    setTimeout(() => {
        window.AdminProtection = new AdminProtectionSystem();
    }, 1000);
}

// إضافة زر لعرض السجلات للمسؤول
setTimeout(() => {
    if (window.currentUser && (window.currentUser.id === "1111" || window.currentUser.username === "texn")) {
        const logBtn = document.createElement('button');
        logBtn.innerHTML = '📋 سجلات الحماية';
        logBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 188, 212, 0.2);
            color: #00bcd4;
            border: 1px solid #00bcd4;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
            font-family: 'Tajawal', sans-serif;
            font-size: 12px;
            z-index: 9990;
            backdrop-filter: blur(10px);
        `;
        logBtn.onclick = () => window.AdminProtection?.showProtectionLogs();
        document.body.appendChild(logBtn);
    }
}, 2000);

console.log('🛡️ نظام حماية الأدمن جاهز للتحميل');
