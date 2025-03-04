/**
 * AWS学习指南网站脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化卡片详情切换功能
    initToggleDetails();
    
    // 初始化图片懒加载
    initLazyLoading();
});

/**
 * 初始化卡片详情切换功能
 */
function initToggleDetails() {
    const toggleButtons = document.querySelectorAll('.toggle-details');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 获取目标详情区域ID
            const targetId = this.getAttribute('data-target');
            const detailsElement = document.getElementById(targetId);
            
            // 切换显示/隐藏状态
            if (detailsElement.style.display === 'none') {
                detailsElement.style.display = 'block';
                this.textContent = '收起详情';
                
                // 添加动画效果
                detailsElement.style.maxHeight = detailsElement.scrollHeight + 'px';
            } else {
                detailsElement.style.display = 'none';
                this.textContent = '查看详情';
                
                // 重置动画效果
                detailsElement.style.maxHeight = '0';
            }
        });
    });
}

/**
 * 初始化图片懒加载功能
 */
function initLazyLoading() {
    // 获取所有带有lazy类的图片
    const lazyImages = document.querySelectorAll('img.lazy');
    
    // 如果支持IntersectionObserver API，使用它来实现懒加载
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    // 将data-src的值赋给src
                    image.src = image.dataset.src;
                    image.classList.add('loaded');
                    // 图片加载后，取消观察
                    imageObserver.unobserve(image);
                }
            });
        });
        
        lazyImages.forEach(function(image) {
            imageObserver.observe(image);
        });
    } else {
        // 回退方案：简单的滚动事件监听
        let lazyLoadThrottleTimeout;
        
        function lazyLoad() {
            if (lazyLoadThrottleTimeout) {
                clearTimeout(lazyLoadThrottleTimeout);
            }
            
            lazyLoadThrottleTimeout = setTimeout(function() {
                const scrollTop = window.pageYOffset;
                
                lazyImages.forEach(function(img) {
                    if (img.offsetTop < (window.innerHeight + scrollTop)) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                    }
                });
                
                // 如果所有图片都已加载，移除滚动事件监听
                if (lazyImages.length === 0) { 
                    document.removeEventListener('scroll', lazyLoad);
                    window.removeEventListener('resize', lazyLoad);
                    window.removeEventListener('orientationChange', lazyLoad);
                }
            }, 20);
        }
        
        // 添加滚动事件监听
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationChange', lazyLoad);
    }
}

/**
 * 内容懒加载功能
 * 当页面滚动到特定区域时加载内容
 */
function lazyLoadContent() {
    const contentSections = document.querySelectorAll('.lazy-content');
    
    if ('IntersectionObserver' in window) {
        const contentObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    // 加载内容（可以是AJAX请求或显示预加载的内容）
                    section.classList.add('loaded');
                    // 内容加载后，取消观察
                    contentObserver.unobserve(section);
                }
            });
        });
        
        contentSections.forEach(function(section) {
            contentObserver.observe(section);
        });
    }
}

// 页面加载完成后初始化内容懒加载
window.addEventListener('load', function() {
    lazyLoadContent();
});