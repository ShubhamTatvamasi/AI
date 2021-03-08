document.getElementById('btn_custom_file').addEventListener('click', function(){
  document.getElementById('btn_video').click()
})

document.getElementById('btn_reset').addEventListener('click', function(){
  location.reload()
})

document.getElementById('btn_realtime').addEventListener('click', function(){
  location.href = "/"
})

document.getElementById('btn_video').addEventListener('change', function(){
    var file = document.getElementById('btn_video').files[0]
    var vid = document.getElementById('video')
    vid.style.width = "100%"
    vid.src = URL.createObjectURL(file)
    vid.hidden = false
    vid.loop = true
    document.getElementById('canvas_container').hidden = true
    document.getElementById('btn_custom_file').hidden = true
    document.getElementById('btn_reset').hidden = false

    const config = {smoothness: 0.40, enableBalancer : false};
    const gender_config = {smoothness: 0.95, threshold: 0.70};
    const attention_config = {smoothness: 0.83};
    const wish_config = {smoothness: 0.8};
    const customSource = CY.createSource.fromVideoElement(vid);
    const features_config = {smoothness: 0.90};
    const arousal_config = {smoothness: 0.70};

    var el = document.getElementById('chart');
    el.style.height = "100px";
    el.style.opacity="0.8"
    let startTime = Date.now();
    let noDataTimeOut;

    const chart = new EmoChart(el);

    chart.visible = true;

    function updateNoData() {
      chart.updateNoData(getCurrentTime());
      noDataTimeOut = setTimeout(() => updateNoData(), 500);
    }

    function resetTimeout() {
      clearTimeout(noDataTimeOut);
      noDataTimeOut = setTimeout(() => updateNoData(), 500);
    }
    function getCurrentTime() {
      return (Date.now() - startTime)/1000;
    }

    chart.reset();
    resetTimeout();

    CY.loader()
    .source(customSource)
    .addModule(CY.modules().FACE_EMOTION.name, config)
    .addModule(CY.modules().FACE_POSE.name, config)
    .addModule(CY.modules().FACE_AGE.name, {})
    .addModule(CY.modules().FACE_GENDER.name, gender_config)
    .addModule(CY.modules().FACE_ATTENTION.name, attention_config)
    .addModule(CY.modules().FACE_WISH.name, wish_config)
    .addModule(CY.modules().FACE_FEATURES.name, features_config)
    .addModule(CY.modules().FACE_AROUSAL_VALENCE.name, arousal_config)
    .load()
    .then(({ start, stop }) => start());
    window.addEventListener(CY.modules().FACE_AGE.eventName, (evt) => {
      document.getElementById("age").innerHTML=evt.detail.output.numericAge;
      console.clear()
    });

    window.addEventListener(CY.modules().FACE_EMOTION.eventName, (evt) => {

      resetTimeout();
      chart.update(getCurrentTime(), evt.detail.output.emotion);

      document.getElementById('Angry').style.height =  (evt.detail.output.emotion.Angry*100) + "%"
      document.getElementById('Disgust').style.height = (evt.detail.output.emotion.Disgust*100) + "%"
      document.getElementById('Fear').style.height = (evt.detail.output.emotion.Fear*100) + "%"
      document.getElementById('Happy').style.height = (evt.detail.output.emotion.Happy*100) + "%"
      document.getElementById('Neutral').style.height = (evt.detail.output.emotion.Neutral*100) + "%"
      document.getElementById('Sad').style.height = (evt.detail.output.emotion.Sad*100) + "%"
      document.getElementById('Surprise').style.height = (evt.detail.output.emotion.Surprise*100) + "%"
    });

    window.addEventListener(CY.modules().FACE_GENDER.eventName, (evt) => {
      document.getElementById('gender-caption').innerHTML = evt.detail.output.mostConfident
      if(evt.detail.output.mostConfident && evt.detail.output.mostConfident.toLowerCase() == "male"){
        document.getElementById('gender').src="/img/male-icon.jpg"
        document.getElementById('gender').hidden = false
      }
      if(evt.detail.output.mostConfident && evt.detail.output.mostConfident.toLowerCase() == "female")
      {
        document.getElementById('gender').src="/img/female-icon.jpg"
        document.getElementById('gender').hidden = false
      }
      document.getElementById('gender').innerHTML = evt.detail.output.mostConfident
    });

    window.addEventListener(CY.modules().FACE_ATTENTION.eventName, (evt) => {
      document.getElementById('attention').style.height = (evt.detail.output.attention*100) + "%"
    });

    window.addEventListener(CY.modules().FACE_WISH.eventName, (evt) => {
      document.getElementById('wish').style.height = (evt.detail.output.wish*100) + "%"
    });

    window.addEventListener(CY.modules().FACE_AROUSAL_VALENCE.eventName, (evt) => {
      var bottom = (evt.detail.output.calibrated.arousal*100)
      var left = (evt.detail.output.calibrated.valence*100)
      var graph_pin = document.getElementById('grapg_pin')
      left = (left/2) + 50
      bottom = (bottom/2) + 50
      grapg_pin.style.opacity = 0.6
      graph_pin.style.left = left + "%"
      graph_pin.style.bottom = bottom + "%"
    });

    window.addEventListener(CY.modules().FACE_FEATURES.eventName, (evt) => {
      getFeatures('Arched Eyebrows', evt.detail.output.features["Arched Eyebrows"])
      getFeatures('Attractive', evt.detail.output.features["Attractive"])
      getFeatures('Bags Under Eyes', evt.detail.output.features["Bags Under Eyes"])
      getFeatures('Bald', evt.detail.output.features["Bald"])
      getFeatures('Bangs', evt.detail.output.features["Bangs"])
      getFeatures('Big Lips', evt.detail.output.features["Big Lips"])
      getFeatures('Big Nose', evt.detail.output.features["Big Nose"])
      getFeatures('Black Hair', evt.detail.output.features["Black Hair"])
      getFeatures('Blond Hair', evt.detail.output.features["Blond Hair"])
      getFeatures('Brown Hair', evt.detail.output.features["Brown Hair"])
      getFeatures('Chubby', evt.detail.output.features["Chubby"])
      getFeatures('Double Chin', evt.detail.output.features["Double Chin"])
      getFeatures('Earrings', evt.detail.output.features["Earrings"])
      getFeatures('Eyebrows Bushy', evt.detail.output.features["Eyebrows Bushy"])
      getFeatures('Eyeglasses', evt.detail.output.features["Eyeglasses"])
      getFeatures('Goatee', evt.detail.output.features["Goatee"])
      getFeatures('Gray Hair', evt.detail.output.features["Gray Hair"])
      getFeatures('Hat', evt.detail.output.features["Hat"])
      getFeatures('Heavy Makeup', evt.detail.output.features["Heavy Makeup"])
      getFeatures('High Cheekbones', evt.detail.output.features["High Cheekbones"])
      getFeatures('Lipstick', evt.detail.output.features["Lipstick"])
      getFeatures('Mouth Slightly Open', evt.detail.output.features["Mouth Slightly Open"])
      getFeatures('Mustache', evt.detail.output.features["Mustache"])
      getFeatures('Narrow Eyes', evt.detail.output.features["Narrow Eyes"])
      getFeatures('Necklace', evt.detail.output.features["Necklace"])
      getFeatures('Necktie', evt.detail.output.features["Necktie"])
      if(document.getElementById('gender-caption').textContent == "Male"){
        getFeatures('No Beard', evt.detail.output.features["No Beard"])
      }
      getFeatures('Oval Face', evt.detail.output.features["Oval Face"])
      getFeatures('Pale Skin', evt.detail.output.features["Pale Skin"])
      getFeatures('Pointy Nose', evt.detail.output.features["Pointy Nose"])
      getFeatures('Receding Hairline', evt.detail.output.features["Receding Hairline"])
      getFeatures('Rosy Cheeks', evt.detail.output.features["Rosy Cheeks"])
      getFeatures('Sideburns', evt.detail.output.features["Sideburns"])
      getFeatures('Straight Hair', evt.detail.output.features["Straight Hair"])
      getFeatures('Wavy Hair', evt.detail.output.features["Wavy Hair"])
    });
})

function getFeatures(featureName, featureValue){
  var name = featureName.replace(/ /g, '_')
  if(featureValue > 0.45){
    document.getElementById(name).style.display = "block"
  }
  else{
    document.getElementById(name).style.display = "none"
  }
}
document.getElementById('icon_affect').addEventListener('click', function(){
  var elem = document.getElementsByClassName("circle-graph")[0]
  if(elem.style.display == "block"){
    elem.style.display = "none"
    this.style.opacity="0.4"
  }
  else{
    elem.style.display = "block"
    this.style.opacity="1"
  }
})
document.getElementById('icon_emotion').addEventListener('click', function(){
  var elem = document.getElementById('chart_container')
  if(elem.style.display == "block"){
    elem.style.display = "none"
    this.style.opacity="0.4"
  }
  else{
    elem.style.display = "block"
    this.style.opacity="1"
  }
})