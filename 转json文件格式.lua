local cjson = require "cjson"
local lfs = require"lfs"

model_name = {}
function get_model_list (path)
    local array = {}
    local m=1
    for file in lfs.dir(path) do
        if file ~= "." and file ~= ".." then

            local idx = file:match(".+()%.%w+$")
            local name = file:sub(1, idx-1)

            array[m] = name
            m = m+1
        end
    end
    return array
end

model_name = get_model_list ("/usr/local/development/www/ArtConversion/algorithm/models")




local wpath = "/root/work/conf/cc.json"
local  pic = "image/style-"
local  hz = ".jpg"
local ary={}
f = io.open(wpath,"a")
f:write("[\n")

for i=1,52 do 
    ary["name"] = model_name[i]
    ary["value"] = i
    ary["pic"] = pic ..i ..hz

    local json = cjson.encode(ary)
    f:write(json)
    f:write(",\n")
end
f:write("]")
f:close()  
f = nil




