@include = ->

    @rnd = (minv, maxv) =>
        return 0 if maxv < minv
        Math.floor(Math.random()*(maxv-minv+1)) + minv

    @getName = (minlength, maxlength, prefix, suffix) =>
        prefix = prefix || ''
        suffix = suffix || ''
        vocals = 'aeiouyh' + 'aeiou' + 'aeiou'
        cons = 'bcdfghjklmnpqrstvwxz' + 'bcdfgjklmnprstvw' + 'bcdfgjklmnprst'
        allchars = vocals + cons
        length = @rnd(minlength, maxlength) - prefix.length - suffix.length
        length = 1 if length < 1
        consnum = 0
        if prefix.length > 0
            for p in [0...prefix] 
                consnum = 0 if consnum == 2
                if cons.indexOf(p) != -1
                    consnum++;
        else consnum = 1
        
        name = prefix;
        consnum = 0;
        for n in [0..length]
            if (consnum == 1)
                touse = vocals
                consnum = 0
            else touse = allchars;
            c = touse.charAt(@rnd(0, touse.length - 1))
            name = name + c
            consnum = consnum++ % 2

        name = name.charAt(0).toUpperCase() + name.substring(1, name.length) + suffix
    