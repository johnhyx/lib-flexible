//在去深入了解淘宝flexible之前，首先先对一些基础概念做一些了解；

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