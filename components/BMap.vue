<template>
  <div id="map" class="map"></div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props:{
    // 经度
    longitude: {},
    // 纬度
    latitude: {},
    name: {},
    isShowControl: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    name(val) {
      if (val.length >= 0) {
        this.showMap()
      }
    }
  },
  methods: {
    ...mapMutations(['setState']),
    showMap() {
      let BMap = window.BMap;
      let map = window.map;
      let size = new BMap.Size(15);
      map = new BMap.Map("map");
      for (let i = 0; i < this.longitude.length ; i++) {
        let point = new BMap.Point(this.longitude[i], this.latitude[i]);
        let marker = new BMap.Marker(point);
        let label = new BMap.Label(this.name[i], {
            offset: size
        });
        label.setStyle({fontSize: "14px",padding: "2px 5px",background: '#3791FF',borderRadius:"4px",color:"white",border:"none"});
        map.centerAndZoom(point, 15);
        marker.setLabel(label);
        map.addOverlay(marker);
        marker.setAnimation(window.BMAP_ANIMATION_BOUNCE);
        marker.addEventListener('click', () => {
            map.centerAndZoom(point, 15)
        })
      }
      if (this.isShowControl) {
        map.addControl(new BMap.NavigationControl({
            anchor: window.BMAP_ANCHOR_TOP_LEFT
        }));
        map.enableScrollWheelZoom(true)
      } else {
        // 酒店详情页面禁止双击放大
        map.disableDoubleClickZoom();
        // 添加点击放大效果
        map.addEventListener("click", () => {
          this.setState({
            key: 'showMap',
            module: 'common',
            value: true
          });
          setTimeout(() => {
            let BMap = window.BMap;
            let map = window.map;
						map = new BMap.Map("tenzont-map");
						let size = new BMap.Size(20);
						for (let i = 0; i < this.longitude.length ; i++) {
							let point = new BMap.Point(this.longitude[i], this.latitude[i]);
							let marker = new BMap.Marker(point);
							let label = new BMap.Label(this.name[i], {
								offset: size
							});
							label.setStyle({fontSize: "14px",padding: "2px 5px",background: '#3791FF',borderRadius:"4px",color:"white",border:"none"});
							map.centerAndZoom(point, 15);
							marker.setLabel(label);
							map.addOverlay(marker);
							marker.setAnimation(window.BMAP_ANIMATION_BOUNCE);
							marker.addEventListener('click', () => {
								map.centerAndZoom(point, 15)
							})

						}
            map.addControl(new BMap.NavigationControl({
              anchor: window.BMAP_ANCHOR_TOP_RIGHT
            }));
            map.enableScrollWheelZoom(true)
          }, 100) 
        })
      }
    }
  }
}
</script>

<style scoped>
  .map{
    width: 100%;
    height: 100%;
  }
</style>