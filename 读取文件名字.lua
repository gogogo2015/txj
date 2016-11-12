local lfs = require"lfs"
function attrdir (path)
    for file in lfs.dir(path) do
        if file ~= "." and file ~= ".." then
            print(file)
           
        end
    end
end
attrdir ("/usr/local/development/www/ArtConversion/algorithm/models")
