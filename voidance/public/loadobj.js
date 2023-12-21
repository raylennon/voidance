function loadOBJ(filePath) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "/objs/"+filePath , false);
    console.log("Getting /objs/"+filePath)
    xmlhttp.send();
    var result =-1;
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    } 
    var coords = [];
    var normals = [];
    var texture_coords = [];
    var coord_indices = [];
    var texture_indices = [];
    var normal_indices = [];

    var lines = result.split('\n');
    var row = "" 
    // console.log(lines);
    for(var i=0; i<lines.length; i++) {
        row = lines[i];
        if (row.length < 3) {
            continue;
        }
        // console.log(row.slice(0, 2));
        if (row.slice(0, 2)=="v ") {
            coords.push.apply(coords, row.slice(2, -1).split(" ").map(Number));
        }
        else if (row.slice(0, 3)=="vn ") {
            normals.push.apply(normals, row.slice(3, -1).split(" ").map(Number));
        }
        else if (row.slice(0, 3)=="vt ") {
            texture_coords.push.apply(texture_coords, row.slice(3, -1).split(" ").map(Number));
        }
        else if (row.slice(0, 2)=="f ") {
            var matches = row.match(/(?:\s|^)(\d+)\/(\d+)\/(\d+)/g);
            matches.forEach(match => {
                const [, first, second, third] = match.match(/(\d+)\/(\d+)\/(\d+)/);
                coord_indices.push(parseInt(first)-1);
                texture_indices.push(parseInt(second)-1);
                normal_indices.push(parseInt(third)-1);
              });
        }
    }

    // console.log(coords.length/3);
    // console.log(normals.length/3);
    // console.log(texture_coords.length);
    // console.log(coord_indices.length/3);
    // console.log(texture_indices.length/3);
    // console.log(normal_indices.length/3);

    return {
        coords: coords,
        normals: normals,
        texture_coords: texture_coords,
        coord_indices: coord_indices,
        texture_indices: texture_indices,
        normal_indices: normal_indices,
    }
}

export {loadOBJ}