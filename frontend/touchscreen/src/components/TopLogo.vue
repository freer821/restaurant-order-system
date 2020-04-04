<template>
  <div class="back">
    <van-row>
      <van-col>
        <van-image
          height="150px"
          fit="scale-down"
          :src="require('@/assets/images/Layer12.png')"
        />
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
	name: 'TopLogo'
};
</script>

<style>
.back {
	background: url('~@/assets/images/background.jpg') no-repeat center center
		fixed;
	-webkit-background-size: cover;
	-moz-background-size: cover;
	-o-background-size: cover;
	background-size: cover;
	padding-top: 20px;
}
</style>
