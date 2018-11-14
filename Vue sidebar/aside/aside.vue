<template>
  <aside class="aside">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
      <!-- Sidebar user panel (optional) -->
      <div class="top">
        <div class="userImgWrap">
          <img src="http://adminlte.la998.com/dist/img/user2-160x160.jpg" class="userImg" alt="User Image">
        </div>
        <div class="userNameWrap">
          <p class="userName">Alexander Pierce</p>
        </div>
      </div>
      <!-- Sidebar Menu -->
      <ul class="sidebarMenu">
        <li class="treeview">
          <router-link class="a" to="/home">
            <i class="el-icon-setting"></i> <span>首页</span>
          </router-link>
        </li>
        <li class="treeview">
          <router-link class="a" to="/duration">
            <i class="el-icon-setting"></i> <span>在线时长</span>
          </router-link>
        </li>
        <li class="treeview">
          <router-link class="a" to="/task">
            <i class="el-icon-setting"></i> <span>任务耗时</span>
          </router-link>
        </li>
        <li class="treeview">
          <router-link class="a" to="/userInfo">
            <i class="el-icon-setting"></i> <span>用户操作</span>
          </router-link>
        </li>
      </ul>
      <!-- /.sidebar-menu -->
    </section>
    <!-- /.sidebar -->
  </aside>
</template>

<script src='./aside.js'></script>

<style lang="scss" src='./aside.scss'></style>
