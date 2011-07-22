function rgb_to_xyz(RGB) {
  var rgb = [];
  for(var i=0; i<RGB.length; i++){
    var n = RGB[i]/255;
    rgb.push( ( n > 0.04045 ? Math.pow( (n+0.055) / 1.055, 2.4) : (n/12.92)) * 100);
  }
  return [
    rgb[0] * 0.4124 + rgb[1] * 0.3576 + rgb[2] * 0.1805,
    rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722,
    rgb[0] * 0.0193 + rgb[1] * 0.1192 + rgb[2] * 0.9505
  ];
}

function xyz_to_lab(XYZ) {
  var ref = [95.047, 100.000, 108.883];
  for(var i=0; i<ref.length; i++){
    var n = XYZ[i]/ref[i];
    ref[i] = n > 0.008856 ? Math.pow(n, 1/3) : (7.787*n)+(16/116);
  }
  return [
    (116 * ref[1]) - 160,
    500 * (ref[0] - ref[1]),
    200 * (ref[1] - ref[2])
  ];
}

function rgb_to_lab(RGB){
  return xyz_to_lab(rgb_to_xyz(RGB));
}
