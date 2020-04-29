<template>
  <div>
    <!-- mian-content -->
    <div class="main-content" id="home">
    </div>
    <!--/ab -->

    <!--/newsletter -->
    <section class="py-lg-5 py-4">
      <div class="container">
        <div class="newsletter-info text-center p-md-5 py-md-0 py-5 px-md-0 px-4">
          <form class="d-flex">
            <input  v-model="fuzzyContent" type="text" name="demo" placeholder="请输入要检索的关键词..." required="">
            <input @click="submitData" type="button" value="搜索关键字并下载文档" :disabled="buttonDisabled">
          </form>
        </div>
      </div>
    </section>
    <!--//newsletter-->

    <!--&lt;!&ndash; banner-w3layouts &ndash;&gt;-->
    <!--<section class="ab-info-main py-md-5 py-5">-->
      <!--<div class="container py-md-5 py-5">-->
        <!--<div class="ab-info-grids pt-md-5 pt-0">-->
          <!--<div class="blog-sec pt-md-3 pt-3">-->
            <!--<h3 class="tittle text-uppercase text-center mb-lg-5 mb-3 inner-tittle"><span class="sub-tittle">检测结果 </span>商品数据</h3>-->
            <!--<div class="row mt-lg-5 mt-3">-->
              <!--<div class="col-lg-8 blog-left-content">-->
                <!--<div class="card" data-aos="fade-up">-->
                  <!--<div class="card-body">-->
                    <!--<h6 class="date"><span>-->
                                     <!--店铺名称：嘻嘻嘻店铺</span> 商品价格：100元</h6>-->
                    <!--<h5 class="card-title"><a class="b-post text-dark">商品标题</a></h5>-->
                    <!--<p class="card-text"><a href="">淘宝网链接</a></p>-->
                    <!--<p class="card-text"><a href="">搜款网链接</a></p>-->
                  <!--</div>-->
                  <!--<div class="card-footer">-->
                    <!--<small class="text-muted">上架时间: 20.2018</small>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</section>-->

    <!-- //banner-w3layouts -->

    <!-- copy-w3layoutsright -->
    <div class="cpy-right text-center py-3">
      <p class="copy-w3layouts">Copyright &copy; 2019.最终解释权归 <a href="http://www.pjzbz.cn/" target="_blank" title="找不着网络">找不着网络</a> 所有
      </p>
    </div>
    <!-- //copy-w3layoutsright -->
    <!--model-forms-->
    <!--/Login-->
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header text-left">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">

            <div class="login px-4 mx-auto mw-100">
              <h5 class="text-left mb-4">Login Now</h5>
              <form action="#" method="post">
                <div class="form-group">
                  <label class="mb-2">Email address</label>
                  <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="" required="">
                  <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div class="form-group">
                  <label class="mb-2">Password</label>
                  <input type="password" class="form-control" id="exampleInputPassword1" placeholder="" required="">
                </div>
                <div class="form-check mb-2">
                  <input type="checkbox" class="form-check-input" id="exampleCheck1">
                  <label class="form-check-label" for="exampleCheck1">Check me out</label>
                </div>
                <button type="submit" class="btn btn-primary submit mb-4">Sign In</button>
                <p class="text-left pb-4">
                  <a href="#" data-toggle="modal" data-target="#exampleModalCenter2"> Don't have an account?</a>
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
    <!--//Login-->
    <!--&lt;!&ndash;/Register&ndash;&gt;-->
    <!--<div class="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-hidden="true">-->
      <!--<div class="modal-dialog modal-dialog-centered" role="document">-->
        <!--<div class="modal-content">-->
          <!--<div class="modal-header text-left">-->
            <!--<button type="button" class="close" data-dismiss="modal" aria-label="Close">-->
              <!--<span aria-hidden="true">&times;</span>-->
            <!--</button>-->
          <!--</div>-->
          <!--<div class="modal-body">-->
            <!--<div class="login px-4 mx-auto mw-100">-->
              <!--<h5 class="text-left mb-4">Register Now</h5>-->
              <!--<form action="#" method="post">-->
                <!--<div class="form-group">-->
                  <!--<label>First name</label>-->

                  <!--<input type="text" id="validationDefault01" class="form-control" placeholder="" required="">-->
                <!--</div>-->
                <!--<div class="form-group">-->
                  <!--<label>Last name</label>-->
                  <!--<input type="text" id="validationDefault02" class="form-control" placeholder="" required="">-->
                <!--</div>-->

                <!--<div class="form-group">-->
                  <!--<label class="mb-2">Password</label>-->
                  <!--<input type="password" id="password1" class="form-control" placeholder="" required="">-->
                <!--</div>-->
                <!--<div class="form-group">-->
                  <!--<label>Confirm Password</label>-->
                  <!--<input type="password" id="password2" class="form-control" placeholder="" required="">-->
                <!--</div>-->

                <!--<button type="submit" class="btn btn-primary submit mb-4">Register</button>-->
                <!--<p class="text-left pb-4">-->
                  <!--<a href="#">By clicking Register, I agree to your terms</a>-->
                <!--</p>-->
              <!--</form>-->

            <!--</div>-->
          <!--</div>-->

        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      fuzzyContent: '',
      buttonDisabled: false
    }
  },
  methods: {
    submitData() {
      this.buttonDisabled = true
      // this.fullscreenLoading = true
      const xlsName = JSON.stringify(this.fuzzyContent)
      this.$request({
        responseType: 'blob',
        method: 'get',
        url: '/tusou-stall-shop-item-info/fuzzy/excel/download',
        // url: 'https://api.loongwine.cn/cantfind/spider/api/spider/tusou/task/download',
        params: {
          content: this.fuzzyContent
        }
      }).then(res => {
        const blob = new Blob([res])// 处理文档流
        const fileName = xlsName + '.xls'
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
        // this.redirect ||
      }).finally(() => {
        // this.fullscreenLoading = false
        this.buttonDisabled = false
      })
    }
  }
}
</script>
<style scoped>
  @import 'css/bootstrap.css';
  @import 'css/style.css';
  @import 'css/portfolio.css';
  @import 'css/aos.css';
  @import 'css/aos-animation.css';
  @import 'css/font-awesome.css';
  /*@import 'http://fonts.googleapis.com/css?family=Poppins:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900';*/
  /*@import 'http://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700i';*/
</style>
