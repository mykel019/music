<template>
  <div>
    <div class="portfolio">
      <div class="portfolio-title">Project title</div>
      <div class="portfolio-title">Project title</div>
      <!-- <div class="portfolio-title">Project title</div>
      <div class="portfolio-title">Project title</div>
      <div class="portfolio-title">Project title</div>
      <div class="portfolio-title">Project title</div> -->
    </div>

    <!-- <div class="clip-path">
      <h1>Portfolio Title</h1>
    </div> -->

    <!-- <div>
      <h1>Air Max</h1>
    </div>

    <div>
      <input type="file" @change="inputFile">
      <img class="image" alt="">
    </div> -->


  </div>
</template>

<script setup>
  const inputFile = (event) => { 
  //  let image = document.querySelector('.image')
  //  image.src = URL.createObjectURL(event.target.files[0]);

  const reader = new FileReader()
  reader.addEventListener("load", () => {
    document.querySelector(".image").src = reader.result
  })
  reader.readAsDataURL(event.target.files[0]);

  }
</script>

<style scoped>
*{
 box-sizing: border-box; 
}
.portfolio{
  padding: 1em;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-gap: 1em;
  border: 1px solid #000;
}
.portfolio-title{
    text-align: center;
    color: #00C896;
    grid-column: 1em;
    border: 1px solid #000;
    padding: 10px;
  }
.clip-path{
  width: 500px;
  height: 500px;
  position: relative;
  left: 30%;
  border: 1px solid red;
  background: red;
}
.clip-path::after{
  content: "";
  position: absolute;
  inset: 0;
  background-color: lightgreen;
  clip-path: polygon(50% 0%, 61% 35%, 100% 36%, 68% 57%, 100% 100%, 50% 70%, 0 100%, 32% 57%, 0 35%, 39% 35%);
}

h1{
  background-image: url('https://fastly.picsum.photos/id/159/200/300.jpg?hmac=CC6862WSVsX6F74hcV30UzS4czPi0LO6zPJDaEaQeFU');
  background-clip: text;
  color: transparent;
  background-color: white;
  font-size: 150px;
  font-weight: 700;
}

.image{
  border-radius: 50%;
  max-width: 100%;
  aspect-ratio: 1;
}


</style>