//在去深入了解淘宝flexible之前，首先先对一些基础概念做了一些了解；

//视窗Viewport
/*
*简单来说，viewport是严格等于浏览器的窗口。在pc端来说，viewport就是浏览器的宽度和高度，
* 但是在移动设备就相对复杂了许多。
*
* 移动端的viewport太窄了，为了更好的css布局，所以提供了两个viewport虚拟的viewportvisualviewport和布局的viewportlayoutviewport。
*/

//物理像素

/*
*物理像素又被成为设备像素，他是设备中最微小的物理部件。每个像素可以根据操作系统设置自己的
* 颜色和亮度，整理这些设备像素之间微小距离欺骗了我们肉眼看到的图像效果。
*/

//设备独立像素
/*
*设备独立像素又称为密度无关像素，可以认为是计算机坐标系统中的一个点，这个点代表一个可以由
*  程序使用的虚拟像素（比如css像素），然后又相关系统转换为屋里像素。
*/

//css像素

/*
* css像素是一个抽象的单元，主要使用在浏览器上，用来精确度量web页面上的内容。一般情况下，css像素称为与设备无关的像素，简称DIPS
*/

//设备像素比

/*
*设备像素比简称为dpr，其定义了物理像素和设备独立像素的对应关系。他的值可以按如下公式计算：
* 设备像素比 = 物理像素比 / 设备独立像素
* 在JavaScript中，可以通过window.devicePixelRatio获取到当前设备的dpr。
* 而在CSS中，可以通过-webkit-device-pixel-ratio，-webkit-min-device-pixel-ratio和 -webkit-max-device-pixel-ratio进行媒体查询，
* 对不同dpr的设备，做一些样式适配(这里只针对webkit内核的浏览器和webview)。
* dip或dp,（device independent pixels，设备独立像素）与屏幕密度有关。dip可以用来辅助区分视网膜设备还是非视网膜设备。
*
* 由上述的几个概念，可以用图dpr来概括；
*/


/*
 * 众所周知，iPhone的设备宽度和高度为375*667，可以理解为设备独立像素，而其dpr为2，我们计算其物理像素为750*1334；
 */


//meta标签

/*
*<meat>标签有很多种，主要就是介绍是viewport的meta标签，主要功能就是告诉浏览器如何规范渲染渲染WEB页面
* 我们需要设置视图是多大的，在移动端页面开发时，我们需要设置meta标签如下：
* <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
*代码以显示网页的屏幕宽度定义类视图宽度，网页的比例和最大比例被设置为100%。lib-flexidle解决方案中，需要依赖meta标签
*
*/

//使用方法

/*
*lib-flexble库的使用方法非常简单，只需要在web页面的<head></head> 中添加对应的flexible_css.js,flexible.js文件
* 一种方法就是将文件下载到自己的项目中，然后通过相对路径添加：
*   <script src="build/flexible_css.debug.js"></script>
*   <script src="build/flexible.debug.js"></script>
*
* 或者直接加载阿里CDN文件：
*   <script src="http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/??flexible_css.js,flexible.js"></script>
*
*对于这段js，团队给的建议是对js做 内联处理，在所有资源加载之前执行这个js。在执行这段js后，
* 会在<html>元素上添加一个data-dpr属性，以及一个font-size样式。js会根据不同的设备添加不同的data-dpr值；同时给<html>加上对应的font-size值
*
* 这样之后，页面上的元素，都可以通过rem单位来设置。然后会根据<html>的font-size值做相应计算，实现屏幕的适配效果。
*
* 除此之外，在引入lib-flexible需要执行的js之前，可以手动设置meta来控制dpr的值
*/


//flexible源码
/*
*使用立即函数表达式，避免全局作用域污染
* 通过传入window对象，可以使window对象变成局部变量
* 当在代码访问window对象是，就不需要将作用域退回到顶层作用域，这样可以更快的访问到window
* 将window对象作为参数传入，还可以在代码压缩是进行优化
*/
;(function(win, lib) {
    var doc = win.document;//document对象
    var docEl = doc.documentElement;//文档根节点
    var metaEl = doc.querySelector('meta[name="viewport"]');//获取name值为viewport的meta节点
    var flexibleEl = doc.querySelector('meta[name="flexible"]');
    var dpr = 0;//初始化dpr
    var scale = 0;//初始化缩放比例
    var tid;//定时器id
    var flexible = lib.flexible || (lib.flexible = {});//将flexible对象暴露给全局作域，这样就可以直接在外部调用内部的一些方法和变量

    if (metaEl) {//如果文档已经设置了‘viewport’
        console.warn('将根据已有的meta标签来设置缩放比例');
        var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);//获取到‘content’的属性值，并用正则模式匹配
        if (match) {//在‘content’属性设置了‘缩放比例’
            scale = parseFloat(match[1]);//获取缩放比例
            dpr = parseInt(1 / scale);//获取dpr
        }
    } else if (flexibleEl) {
        var content = flexibleEl.getAttribute('content');
        if (content) {
            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if (initialDpr) {
                dpr = parseFloat(initialDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
            if (maximumDpr) {
                dpr = parseFloat(maximumDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
        }
    }

    if (!dpr && !scale) {//dpr和缩放比例都没有设置
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        var devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {//苹果设备
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                dpr = 3;//scale = 0.3333333
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
                dpr = 2;//scale = 0.5
            } else {
                dpr = 1;//scale = 1
            }
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
        }
        scale = 1 / dpr;//获取缩放比例
    }

    docEl.setAttribute('data-dpr', dpr);//在根节点设置'data-dpr'属性，这个属性相当重要，有这个属性我们就可以，设置不同缩放比例下的字体的大小，设置依然使用rem；
    if (!metaEl) {//文档没有设置‘viewport’
        metaEl = doc.createElement('meta');//创建一个‘meta’节点
        metaEl.setAttribute('name', 'viewport');//设置‘meta’节点的name属性
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no')//设置meta节点的'content'属性;
        if (docEl.firstElementChild) {//判断有没有元素，兼容
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }
    /*
    * '普通屏幕'一个css像素 => 一个物理像素
    * '视网膜屏'一个css像素 => 四个物理像素
    */
    function refreshRem(){
        var width = docEl.getBoundingClientRect().width;//获取设备上document元素的宽度值，利用getBoundingClientRect()方法；
        if (width / dpr > 540) {//'css'最高像素是540（是一个经验值）;
            width = 540 * dpr;//设置document的width
        }
        var rem = width / 10//计算出基准像素
        docEl.style.fontSize = rem + 'px';//设置文档的基准像素
        flexible.rem = win.rem = rem;//定义了一个全局变量，可以通过window.rem或者lib.flexible.rem来获取基准像素

    }

    win.addEventListener('resize', function() {//监听视图窗口发生变化
        clearTimeout(tid);//清空计时器，防止再次触发refreshRem函数
        tid = setTimeout(refreshRem, 300);//延迟300毫秒，重新计算并设置html的'font-size'
    }, false);
    win.addEventListener('pageshow', function(e) {/*重载页面时候触发，这里监听pagashow事件没有监听load事件的原因是，在opera和火狐浏览器中，pageshow事件在后退/前进这两个动作是会触发，
                                                     但是load事件因为页面已经被加载过了，被存到缓存里面就不会触发了，所以我们选择监听pageshow事件。*/
        if (e.persisted) {//从缓存中加载页面(浏览器自带后退功能)
            clearTimeout(tid);//清空计时器，防止再次触发refreshRem函数
            tid = setTimeout(refreshRem, 300);//延迟300毫秒，重新计算并设置html的'font-size'
        }
    }, false);

    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = 12 * dpr + 'px';
    } else {
        doc.addEventListener('DOMContentLoaded', function(e) {//DOM构建完成后触发
            doc.body.style.fontSize = 12 * dpr + 'px';//设置body的默认字体大小
        }, false);
    }


    refreshRem();

    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function(d) {//将rem转换为px
        var val = parseFloat(d) * this.rem;//this.rem是基准像素
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';//将值转换为字符串，并带上'px'单位
        }
        return val;
    }
    flexible.px2rem = function(d) {//将px转换为rem
        var val = parseFloat(d) / this.rem;//this.rem是基准像素
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';//将值转换为字符串，并带上'rem'单位
        }
        return val;
    }

})(window, window['lib'] || (window['lib'] = {}));//window[ 'lib' ] = {} 等同于 var lib = {} 这里很隐晦的定义了一个全局变量'lib';