<template lang="html">
    <v-menu absolute v-model="show" top :close-on-content-click="false">
        <slot slot="activator" name="activator">
            <v-btn slot="activator" icon small>
                <v-icon color="black" size="17">format_color_fill</v-icon>
            </v-btn>
        </slot>

        <v-card class="ivuup-color-picker">
            <v-card-text>
                <canvas ref="block" @click="blockClick" height="150" width="150"></canvas>
                <canvas ref="strip" @click="stripClick" height="150" width="30"></canvas>
            </v-card-text>
            <v-card-actions>
                <v-btn
                    class="preset"
                    fab
                    small
                    :color="hex"
                    @click="color = hex"
                    v-for="hex in preset"
                    >
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script>
    export default {
        mounted(){
            var contextBlock = this.$refs.block.getContext('2d');
            var contextStrip = this.$refs.strip.getContext('2d');

            contextBlock.rect(0, 0, this.$refs.block.width, this.$refs.block.height);
            this.fillGradient('#fff');

            contextStrip.rect(0, 0, this.$refs.strip.width, this.$refs.strip.height);
            var grd1 = contextStrip.createLinearGradient(0, 0, 0, this.$refs.block.height);
            grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
            grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
            grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
            grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
            grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
            grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
            grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
            contextStrip.fillStyle = grd1;
            contextStrip.fill();
        },
        data(){
            return {
                show: false,
                preset: ['#000','#0061ff','#ff0019','#008e0e'],
                color: null
            }
        },
        watch:{
            color(color){
                this.$emit('input', color)
                this.show = false
            }
        },
        methods:{
            blockClick(event){
                let x = event.offsetX;
                let y = event.offsetY;
                let imageData = this.$refs.block.getContext('2d').getImageData(x, y, 1, 1).data;
                this.color = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
            },
            fillGradient(color) {
                let contextBlock = this.$refs.block.getContext('2d');
                let contextSrip = this.$refs.strip.getContext('2d');

                contextBlock.fillStyle = color;
                contextBlock.fillRect(0, 0, this.$refs.block.width, this.$refs.block.height);

                var grdWhite = contextSrip.createLinearGradient(0, 0, this.$refs.block.width, 0);
                grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
                grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
                contextBlock.fillStyle = grdWhite;
                contextBlock.fillRect(0, 0, this.$refs.block.width, this.$refs.block.height);

                var grdBlack = contextSrip.createLinearGradient(0, 0, 0, this.$refs.block.height);
                grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
                grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
                contextBlock.fillStyle = grdBlack;
                contextBlock.fillRect(0, 0, this.$refs.block.width, this.$refs.block.height);
            },
            stripClick(event){
                let x = event.offsetX;
                let y = event.offsetY;
                let imageData = this.$refs.strip.getContext('2d').getImageData(x, y, 1, 1).data;
                let color = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)'
                this.fillGradient(color);
            }
        }
    }
</script>

<style lang="css" scoped>
    canvas:hover {
      cursor: crosshair;
    }

    button.preset{
        margin: 0 auto;
        width: 20px;
        height: 20px;
    }
</style>
