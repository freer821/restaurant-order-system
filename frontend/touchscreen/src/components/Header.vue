<template>
  <div style="background-color: #2e130a;">
    <van-row>
      <van-col span="6">
        <van-image
          height="150px"
          fit="contain"
          :src="require('@/assets/images/g1.png')"
        />
      </van-col>
      <van-col span="6">
        <van-image
          height="150px"
          fit="contain"
          :src="require('@/assets/images/g3.png')"
        />
      </van-col>
      <van-col span="6">
        <van-image
          height="150px"
          fit="contain"
          :src="require('@/assets/images/g1.png')"
        />
      </van-col>
      <van-col span="6">
        <van-image
          height="150px"
          fit="contain"
          :src="require('@/assets/images/g4.png')"
        />
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
	name: 'Header'
};
</script>