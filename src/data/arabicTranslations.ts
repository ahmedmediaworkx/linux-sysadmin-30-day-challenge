import { DayChallenge, LabCategory } from '../types';

export const categoryArabicMap: Record<string, string> = {
  'Basics & CLI': 'أساسيات النظام والـ CLI',
  'Permissions & Users': 'المستخدمين والصلاحيات (Permissions)',
  'Processes & Services': 'العمليات والخدمات (Systemd & Processes)',
  'Networking': 'الشبكات والـ IP Networking',
  'Storage & LVM': 'التخزين والـ LVM Partitions',
  'Security & Firewall': 'الأمان والحماية (Firewall & SSH)',
  'Web Servers & Proxy': 'سيرفرات الويب والـ Nginx Proxy',
  'Automation & Scripts': 'الأتمتة واسكريبتات Bash',
  'Containers & Docker': 'الحاويات وتقنيات Docker',
  'Kernel & Performance': 'النواة والأداء (Kernel & Performance)',
  'Observability & Logs': 'المراقبة ومتابعة الـ Logs',
  'High Availability': 'الجاهزية العالية (High Availability)'
};

export const daysArabicData: Record<string, Partial<DayChallenge>> = {
  'day-1': {
    title: 'أساسيات شاشة الـ Terminal وإدارة الملفات بالـ CLI',
    summary: 'اتعلم الأوامر الأساسية للتعامل مع المجلدات، التنقل، والبحث السريع داخل نظام Linux.',
    studentObjective: 'نفذ أوامر ls, cd, mkdir, find, grep عشان تدور على الملفات وتدير المجلدات بمهارة.',
    seniorAdvice: 'دايماً استخدم `alias` وحافظ على ترتيب المجلدات بتاعتك بالـ CLI عشان تنجز وقتك في شغل الـ Production.'
  },
  'day-2': {
    title: 'إدارة المستخدمين، المجموعات، وصلاحيات الـ Sudo',
    summary: 'اعمل Users و Groups جديدة واضبط صلاحيات الـ Sudo لكل مهندس حسب وظيفته.',
    studentObjective: 'اعمل useradd و usermod وضبط ملف /etc/sudoers.d بآمان.',
    seniorAdvice: 'اوعى تدي صلاحيات `ALL=(ALL) ALL` كاملة للناس كلها، خيار `visudo` هو الطريقة الآمنة لتعديل السودو.'
  },
  'day-3': {
    title: 'التحكم في الـ Processes ومتابعة استهلاك الـ CPU والـ RAM',
    summary: 'ازاي تشخص الـ Processes اللي معلقة وتوقف السيرفر وترتب الأولوية بالـ kill و nice.',
    studentObjective: 'استخدم ps, top, htop, kill, htop عشان تنضف الـ RAM والـ CPU من الأوامر المعلقة.',
    seniorAdvice: 'استخدم SIGTERM (15) الأول قبل ما تضرب SIGKILL (9) عشان السيرفر يقفل البيانات بآمان من غير كوررپشن.'
  },
  'day-4': {
    title: 'صلاحيات الملفات المتقدمة (chmod, chown, ACLs)',
    summary: 'فهم صلاحيات RWX بالتفصيل وإدارة الـ POSIX ACLs للفرق المشتركة.',
    studentObjective: 'اضبط صلاحيات chown و chmod و setfacl عشان تضمن الأمان للملفات الحساسة.',
    seniorAdvice: 'الـ ACLs بتديك مرونة تدي صلاحية لليوزر من غير ما تلغبط المجموعات الرئيسية.'
  },
  'day-5': {
    title: 'إدارة الباكيجات والـ Package Managers (APT / YUM / DNF)',
    summary: 'ازاي تثبت وتحدث المكونات وتدير الـ Repositories الرسمية في السيرفرات.',
    studentObjective: 'نفذ عمليات apt update, install, hold وسجل الـ Log للبرامج المثبتة.',
    seniorAdvice: 'ثبت دايماً التحديثات الأمنية بس، وما تستخدمش repos غير موثوقة في الـ Production.'
  },
  'day-6': {
    title: 'استكشاف الـ Logs بالنظام وعرض ملفات /var/log',
    summary: 'ازاي تقرأ الـ Logs باستخدام journalctl و tail و grep لو السيرفر وقع.',
    studentObjective: 'افحص الـ systemd journal واستخرج أخطاء الـ SSH والـ Kernel بسهولة.',
    seniorAdvice: 'تعلم خيار `journalctl -u service_name -f` هتخليك تشوف أخطاء الـ Service لحظة بلحظة.'
  },
  'day-7': {
    title: 'أساسيات الشبكات وعناوين الـ IP و DNS Routing',
    summary: 'اختبار الاتصال بالشبكة باستخدام ip, ping, netstat, ss, dig.',
    studentObjective: 'حدد الأسباب لما سيرفر ميبقاش شايف الشبكة الخارجية وتأكد من الـ DNS.',
    seniorAdvice: 'امر `ss -tulpn` هيعرفك مين البورت المفتوح ومين البرنامج اللي شغال عليه فوراً.'
  },
  'day-8': {
    title: 'حماية السيرفر مع UFW و FirewallD',
    summary: 'تأمين البورتات المفتوحة وقفل البورتات غير المصرح بها فوراً.',
    studentObjective: 'اعمل القواعد الأساسية لحظر الكل وسماح بورتات SSH (22) و Web (80/443).',
    seniorAdvice: 'قبل ما تقفل الـ Firewall اتأكد إنك فاتح بورت الـ SSH بتاعك الأول عشان متقفلش على نفسك برة!'
  },
  'day-9': {
    title: 'كتابة اسكريبتات Bash Automation بسيطة',
    summary: 'ازاي تعمل Shell Scripts لأتمتة المهام اليومية وأخذ النسخ الاحتياطية.',
    studentObjective: 'اكتب اسكريبت Bash بيتحقق من السيرفر ويرسل تنبيه بالـ Email أو Log.',
    seniorAdvice: 'حط دايماً `set -euo pipefail` في بداية أي اسكريبت عشان يوقف فوراً لو حصل أي خطأ.'
  },
  'day-10': {
    title: 'أتمتة المهام المجدولة باستخدام Cron Jobs & Systemd Timers',
    summary: 'جدولة اسكريبتات الصيانة الدورية وتتبع المخرجات تلقائياً.',
    studentObjective: 'انشئ cronjob و Systemd timer ينفذ اسكريبت كل يوم الساعة 2 صباحاً.',
    seniorAdvice: 'السيرفرات الحديثة بتفضل Systemd Timers عشان فيها متابعة أفضل وسجلات أخطاء دقيقة.'
  },
  'day-11': {
    title: 'إدارة الأقراص والـ Partitions ونظام LVM',
    summary: 'إنشاء الأقراص وتوسيع الـ Volume Groups من غير ما تقفل السيرفر.',
    studentObjective: 'استخدم pvcreate, vgcreate, lvcreate لزيادة مساحة الهارد ديسك لايف.',
    seniorAdvice: 'الـ LVM اختراع عظيم، بيخليك تكبر الهارد وهو شغال لايف من غير Downtime.'
  },
  'day-12': {
    title: 'توليد مصفوفات RAID وتأمين البيانات ضد الأعطال',
    summary: 'تكوين RAID 1 و RAID 5 لحماية الهاردات من العطل المادي.',
    studentObjective: 'استخدم mdadm لربط الأقراص واختبار عطل هارد مالي وتغييره.',
    seniorAdvice: 'الـ RAID مش بديل للـ Backup، هو بس بيحميك من وقف السيرفر اللحظي.'
  },
  'day-13': {
    title: 'إدارة المساحات والمحاصصة Quotas و SWAP Memory',
    summary: 'تفعيل الـ Swap وتحديد حد أقصى لمساحة كل يوزر لمنع امتلاء السيرفر.',
    studentObjective: 'اضبط swapfile واعمل swappiness لتسريع أداء الـ RAM.',
    seniorAdvice: 'قيمة `vm.swappiness=10` ممتازة للـ Database Servers لمنع البطء.'
  },
  'day-14': {
    title: 'إنشاء وإدارة خدمات Systemd Custom Services',
    summary: 'تحويل أي برنامج أو اسكريبت لخدمة شغال خلف الكواليس مع السيرفر.',
    studentObjective: 'اكتب unit file بمسار /etc/systemd/system/ واعمل enable و start.',
    seniorAdvice: 'تأكد من اختيار `Restart=on-failure` عشان الخدمة ترجع تشتغل لو كراشت.'
  },
  'day-15': {
    title: 'تأمين الاتصال عبر SSH وربط المفاتيح المشفرة',
    summary: 'إلغاء دخول الـ Root وكلمات السر وتفعيل SSH Key Authentication.',
    studentObjective: 'اعمل ssh-keygen واقفل PasswordAuthentication في ملف sshd_config.',
    seniorAdvice: 'غير البورت الافتراضي 22 واعمل خيارات حظر بالـ Fail2ban لحماية السيرفر.'
  },
  'day-16': {
    title: 'تثبيت وتأمين سيرفر Nginx كـ Reverse Proxy',
    summary: 'ربط Nginx بالتطبيقات الداخلية وتفعيل شهادات SSL مجانية.',
    studentObjective: 'اكتب nginx.conf يوجه الترافيك لبرنامج شغال على port 3000.',
    seniorAdvice: 'اكتب دايماً `nginx -t` واختبر الـ Syntax قبل ما تعمل reload للسيرفر.'
  },
  'day-17': {
    title: 'إدارة سياسات SELinux & AppArmor',
    summary: 'التحكم في الأمان على مستوى النواة ومنع اختراق السيرفرات.',
    studentObjective: 'اضبط semanage و restorecon أو aa-status للسماح بالخدمات المصرحة.',
    seniorAdvice: 'متعملش Disable لـ SELinux! اتعلم تعدل الـ Context صح.'
  },
  'day-18': {
    title: 'ضبط أداء النواة Sysctl & Kernel Optimization',
    summary: 'تعديل برامترات الـ Kernel لزيادة سرعة معالجة طلبات الشبكة.',
    studentObjective: 'عدل ملف /etc/sysctl.conf وافتح حد الـ File Descriptors.',
    seniorAdvice: 'احتفظ بنسخة احتياطية من /etc/sysctl.conf قبل ما تعدل أي برامتر أداء.'
  },
  'day-19': {
    title: 'معالجة النصوص المتقدمة مع SED, AWK, & Cut',
    summary: 'فلترة وتحليل ملايين السطور في ملفات الـ Log بلمشة عين.',
    studentObjective: 'استخرج عناوين الـ IP وأكواد الأخطاء 500 من ملفات Nginx logs بـ awk.',
    seniorAdvice: 'الـ AWK و SED أدوات سحرية لمهندس السيرفرات بتوفر ساعات شغل يدوي.'
  },
  'day-20': {
    title: 'تشغيل الحاويات إدارة Docker Containers & Images',
    summary: 'تشغيل المايكروسيرفسز وتأمين شبكات الـ Containers.',
    studentObjective: 'اكتب Dockerfile واعمل build و run للكونتينر وربطه بالـ Network.',
    seniorAdvice: 'استخدم Alpine أو Distroless base images لتقليل حجم الـ Container والأخطاء.'
  },
  'day-21': {
    title: 'تحليل الأداء اللحظي المتقدم بالـ eBPF و BPFtrace',
    summary: 'مراقبة الـ Kernel واستهلاك الـ Disk I/O بمستوى Microsecond.',
    studentObjective: 'استخدم bpftrace و biosnoop للتعرف على التطبيق اللي بيبطئ القرص.',
    seniorAdvice: 'تقنية eBPF هي مستقبل المراقبة في الـ Linux وبتقدم بيانات دقيقة جداً.'
  },
  'day-22': {
    title: 'تشخيص أخطاء الـ Kernel و Memory Leaks بالـ Crash Dump',
    summary: 'ازاي تصرف لما السيرفر يجيله Kernel Panic أو Out of Memory (OOM).',
    studentObjective: 'اقرأ سجلات dmesg و dmesg -T وحلل سبب تدخل الـ OOM Killer.',
    seniorAdvice: 'اضبط الـ OOM Score للخدمات المهمة عشان الـ Kernel ما يقتلهاش الأول.'
  },
  'day-23': {
    title: 'بناء شبكات عالية الجاهزية مع Keepalived & Virtual IP',
    summary: 'ربط سيرفرين ببعض عشان لو الأول وقع، التاني يستلم الـ IP في ثانية واحدة.',
    studentObjective: 'اضبط VRRP Keepalived بين سيرفرين Nginx لتحقيق Failover تلقائي.',
    seniorAdvice: 'اختبر الـ Failover يدوي بفصل السيرفر الأول للـ Verification.'
  },
  'day-24': {
    title: 'موازنة الأحمال العالية مع HAProxy & Load Balancing',
    summary: 'توزيع ترافيك ملايين المستخدمين على مجموعة سيرفرات بدون بطء.',
    studentObjective: 'اضبط haproxy.cfg مع خيارات roundrobin و health checks.',
    seniorAdvice: 'فعل صفحة الـ Stats بكلمة سر متابعة عدد التوصيلات الحية.'
  },
  'day-25': {
    title: 'أتمتة البنية التحتية بالكامل باستخدام Ansible Playbooks',
    summary: 'إدارة 100 سيرفر بضغطة زرار واحدة بدون الحاجة لتثبيت Agent.',
    studentObjective: 'اكتب Ansible Playbook لتثبيت وتأمين Nginx على كل السيرفرات.',
    seniorAdvice: 'استخدم Ansible Vault لتشفير كلمات السر والمفاتيح المشفرة.'
  },
  'day-26': {
    title: 'تأمين الشبكات المتقدم مع WireGuard VPN & IPSec',
    summary: 'إنشاء نفق مشفر بين مراكز البيانات والسيرفرات السحابية.',
    studentObjective: 'اضبط wg0.conf وربط فرعين ببعض بـ VPN سريع جداً.',
    seniorAdvice: 'WireGuard أسرع وأبسط بكتير من OpenVPN القديم.'
  },
  'day-27': {
    title: 'حماية السيرفرات ضد الهجمات مع Fail2ban & Auditd',
    summary: 'حظر الـ IPs المشبوهة تلقائياً وتتبع أي تعديل على ملفات النظام.',
    studentObjective: 'اضبط fail2ban jail للـ SSH وتابع سجلات auditctl.',
    seniorAdvice: 'سجلات auditd بتديك دليل جنائي رقمي كامل في حالة الاختراق.'
  },
  'day-28': {
    title: 'إدارة شبكات وتخزين Kubernetes Cluster Nodes',
    summary: 'ربط الـ Worker Nodes وتجهيز الـ Persistent Volumes.',
    studentObjective: 'استخدم kubectl لاستكشاف أخطاء الـ Pods والـ Storage Class.',
    seniorAdvice: 'تأكد من حدود الـ CPU & Memory Resources لكل Pod لمنع الـ Node Eviction.'
  },
  'day-29': {
    title: 'بناء لوحات المراقبة مع Prometheus & Grafana',
    summary: 'تجميع المقاييس والـ Metrics وإرسال تنبيهات لحظية للفرقة.',
    studentObjective: 'ربط node_exporter مع Prometheus وعرض Dashboard على Grafana.',
    seniorAdvice: 'اضبط تنبيهات الـ Disk Space قبل ما توصل لـ 90% لتجنب الأعطال.'
  },
  'day-30': {
    title: 'تخطيط التعافي من الكوارث Disaster Recovery & Backups',
    summary: 'اختبار استرجاع النظام بالكامل من صفر بعد توقف تام.',
    studentObjective: 'نفذ خطة Disaster Recovery واختبر استرجاع الـ DB والـ Files خلال 15 دقيقة.',
    seniorAdvice: 'الـ Backup اللي متمش اختبار استرجاعه مش موجود اصلاً!'
  }
};

/**
 * Helper to get a localized DayChallenge object.
 * If language is 'ar-EG', merges Arabic title/summary/etc. seamlessly.
 */
export const getLocalizedDay = (day: DayChallenge, lang: string): DayChallenge => {
  if (lang !== 'ar-EG') return day;

  const arData = daysArabicData[day.id];
  const localizedCategory = categoryArabicMap[day.category] || day.category;

  if (!arData) {
    return {
      ...day,
      category: localizedCategory as any
    };
  }

  return {
    ...day,
    title: arData.title || day.title,
    summary: arData.summary || day.summary,
    studentObjective: arData.studentObjective || day.studentObjective,
    seniorAdvice: arData.seniorAdvice || day.seniorAdvice,
    category: localizedCategory as any
  };
};
