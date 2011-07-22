var img = document.createElement("img")
  , can = document.getElementById("canvas")
  , ctx = can.getContext("2d")
  , has_file = false;
$("#file").change(function(evt){
  var file = evt.target.files[0]
    , reader = new FileReader();

  if(file.type.match("image.*")){
    has_file = true;
    reader.onload = function(e){
      img.src = e.target.result;
      function draw(){
        var ratio = img.width/img.height;
        if(img.width < $(window).width()){
          can.width = img.width;
          can.height = img.height;
        }else{
          can.width = $(window).width();
          can.height = $(window).width()/ratio;
        }
        ctx.drawImage(img, 0, 0, can.width, can.height);
      };
      img.onload = draw;
      $(window).resize(draw);
    };
    reader.readAsDataURL(file);
  }
});

$(can).click(function(e){
  if(has_file){
    var color = ctx.getImageData(e.pageX, e.pageY, 1, 1).data
      , cs = closest_colors(color)
      , list = $("<ul>");
    for(var i=0; i<cs.length; i++){
      var color_name = cs[i][1]
        , rgb = colors[color_name]
        , span = $("<span>").addClass("color");

      $("<li>")
        .append(span.clone().html("&nbsp;").css("background", to_rgb(color)))
        .append(span.clone().html("&nbsp;").css("background", to_rgb(rgb)))
        .append(span.clone().html(color_name).css("width", "auto"))
      .appendTo(list);
    }
    $("#list").replaceWith(list.attr("id", "list"));
  }
});

function color_distance(c1, c2){
  var score = 0;
  for(var i=0; i<3; i++){
    score += Math.pow(c1[i]-c2[i], 2);
  }
  return score;
}

function closest_colors(rgb){
  var scores = [];
  for(var color_name in colors){
    scores.push([color_distance(colors[color_name], rgb), color_name]);
  }
  scores.sort(function(a, b){
    return a[0] - b[0];
  })
  return scores.slice(0, 10);
}

function to_rgb(rgb){
  return "rgb(" + [rgb[0], rgb[1], rgb[2]].join(",") + ")";
}
