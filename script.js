var img = document.createElement("img")
  , canvas = document.getElementById("canvas")
  , ctx = canvas.getContext("2d")
  , drop_zone = document.getElementById("drop_zone")
  , has_file = false;

drop_zone.addEventListener('dragover', function(e){
  $(drop_zone).addClass('dragover');
  preventDefault(e);
}, false);

drop_zone.addEventListener('dragleave', function(e){
  $(drop_zone).removeClass('dragover');
}, false);

drop_zone.addEventListener('drop', function(e){
  preventDefault(e);
  image_to_canvas(e.dataTransfer.files[0]);
}, false);

$("#file").change(function(e){
  image_to_canvas(e.target.files[0]);
});

$("#toggle_list").click(function(){
  $("#colors_list").toggle();
});

$(canvas).click(function(e){
  if(has_file){
    var color = ctx.getImageData(e.pageX, e.pageY - 40, 1, 1).data
      , cs = closest_colors(color)
      , list = $("<ul>")
      , li = $("<li>").addClass("color");

    li.clone().text("Name:  #color").appendTo(list);

    for(var i=0; i<cs.length; i++){
      var color_name = cs[i][1]
        , rgb = colors[color_name]
        , inverted_rgb = rgb.map(function(v){ return 255-v; });

      li.clone() 
        .text(color_name + ": #" + inverted_rgb.map(function(v){
          v = v.toString(16);
          if(v.length < 2){ v = "0" + v; }
          return v;
        }).join(""))
        .css({background: to_rgb(rgb), color: to_rgb(inverted_rgb)})
      .appendTo(list);
    }
    $("#colors_list").replaceWith(list.attr("id", "colors_list"));
  }
});

$(canvas).mousemove(function(e){
  //console.log(e.pageX, e.pageY);
});

function image_to_canvas(file){
  var reader = new FileReader();
  if(file.type.match("image.*")){
    $(canvas).show();
    has_file = true;
    reader.onload = function(e){
      img.src = e.target.result;
      function draw(){
        var ratio = img.width/img.height;
        if(img.width < $(window).width()){
          canvas.width = img.width;
          canvas.height = img.height;
        }else{
          canvas.width = $(window).width();
          canvas.height = $(window).width()/ratio;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.onload = draw;
      $(window).resize(draw);
    };
    reader.readAsDataURL(file);
  }
}

function color_distance(c1, c2){
  var score = 0;
  for(var i=0; i<3; i++){
    score += Math.pow(c1[i]-c2[i], 2);
  }
  return score;
}

function closest_colors(rgb){
  var scores = []
    , lab = rgb_to_lab(rgb);
  for(var color_name in colors){
    scores.push([color_distance(rgb_to_lab(colors[color_name]), lab), color_name]);
  }
  scores.sort(function(a, b){
    return a[0] - b[0];
  })
  return scores.slice(0, 10);
}

function to_rgb(rgb){
  return "rgb(" + [rgb[0], rgb[1], rgb[2]].join(",") + ")";
}

function preventDefault(e){
  e.stopPropagation();
  e.preventDefault();
}
