#!/usr/bin/env python
# -*- coding: utf-8 -*-
# vim: et sw=4 ts=4

try:
   import json as simplejson
except:
   import simplejson

import os, codecs, shutil, copy, re

class Threeify(object):

    def __init__(self):

        VERSION         = '2.8.0'
        TNT_VERSION     = '2'

        SRC_DIR        = '../'
        SRC_FILE        = VERSION + '_expanded.json'

        # YUI2_DIR        = '../../yui2/build/'
        YUI2_DIR        = 'lib/' + VERSION + '/build/'

        TEMPLATE_DIR    = 'template'
        TEMPLATE_FILE   = 'yui3mod.js'
        SUPERSEDED_FILE = 'superseded.js'

        DEST_DIR        = 'build_tmp'
        dest_path      = os.path.abspath(DEST_DIR)

        if not os.path.exists(dest_path):         
            os.mkdir(dest_path)

        DEST_JSON       = VERSION + '.json'

        # BUILD_DIR       = 'build_tmp/' + VERSION + '_build/'
        # build_path     = os.path.abspath(BUILD_DIR)

        build_path       = os.path.join(dest_path, TNT_VERSION)

        if not os.path.exists(build_path):         
            os.mkdir(build_path)

        build_path       = os.path.join(build_path, VERSION)

        if not os.path.exists(build_path):         
            os.mkdir(build_path)

        TOKENS = {}

        TOKENS['name'] =    '{ /* NAME */ }' 
        TOKENS['superseded'] = '{ /* SUPERSEDED */ }' 
        TOKENS['content'] = '{ /* SOURCE */ }' 
        TOKENS['data'] =    '{ /* DATA */ }' 
        TOKENS['version'] =    '{ /* VERSION */ }' 

        src_path       = os.path.abspath(SRC_DIR)
        print src_path
        yui2_path      = os.path.abspath(YUI2_DIR)

        template_path  = os.path.abspath(TEMPLATE_DIR)


        print dest_path

        shutil.rmtree(build_path, True)
        shutil.copytree(yui2_path, build_path)

        def readFile(path, file):
            return codecs.open(os.path.join(path, file), "r", "utf-8").read()

        src_str = readFile(src_path, SRC_FILE)
        src    = simplejson.loads(src_str)

        jsonstr = simplejson.dumps(src, ensure_ascii=False, sort_keys=True, indent=4)

        print jsonstr

        # write the raw module json
        out = codecs.open(os.path.join(dest_path, DEST_JSON), 'w', 'utf-8')
        out.writelines(jsonstr)
        out.close()

        template = readFile(template_path, TEMPLATE_FILE)
        superseded = readFile(template_path, SUPERSEDED_FILE)

        for name, mod in src.iteritems():
            type = 'js'
            if 'type' in mod:
                type = mod['type']

            print name

            paths = []

            path_min = mod['path']
            print path_min

            paths.append(path_min)

            path = path_min.replace('-min', '-debug')
            if path != path_min:
                paths.append(path)
                print path
            path = path_min.replace('-min', '')
            if path != path_min:
                paths.append(path)
                print path

            try:
                content  = readFile(yui2_path, path_min)
            except:
                print 'WARNING: could not find file ' + path_min
                continue;

            modcopy = copy.deepcopy(mod)

            if 'path' in modcopy:
                del modcopy['path']
            if 'pkg' in modcopy:
                del modcopy['pkg']

            data     = simplejson.dumps(modcopy, ensure_ascii=False)

            count = 0
            for path in paths:

                if count == 1:
                    filter = '-debug.'
                elif count == 2:
                    filter = '.'
                else:
                    filter = '-min.'

                count += 1

                try:
                    content = readFile(yui2_path, path)
                except:
                    print 'WARNING: could not find file ' + path_min
                    continue;

                supcontent = ''

                if 'supersedes' in mod:
                    sups = mod['supersedes']
                    for supname in sups:
                        supmod    = copy.deepcopy(src[supname])
                        # supmod    = src[supname]
                        if 'path' in supmod:
                            del supmod['path']
                        if 'pkg' in supmod:
                            del supmod['pkg']
                        supdata   = simplejson.dumps(supmod, ensure_ascii=False)
                        supresult = superseded
                        supresult = supresult.replace(TOKENS['name'], supname)
                        supresult = supresult.replace(TOKENS['data'], supdata)
                        supresult = supresult.replace(TOKENS['content'], '')
                        supcontent += supresult

                if type == 'js':
                    result = template
                    result = result.replace(TOKENS['name'], name)
                    result = result.replace(TOKENS['content'], content)
                    result = result.replace(TOKENS['superseded'], supcontent)
                    result = result.replace(TOKENS['data'], data)
                    result = result.replace(TOKENS['version'], VERSION)
                else:
                    result = content


                out = codecs.open(os.path.join(build_path, path), 'w', 'utf-8')
                out.truncate(0)
                out.writelines(result)
                out.close()

                # default path

                default_path = os.path.join(build_path, name)
                if not os.path.exists(default_path):         
                    os.mkdir(default_path)

                if name.count('skin-') > 0:
                    pkg = re.search('^[^\/]*', path)
                    print "pkg: " + pkg.group(0)
                    original_path = os.path.join(build_path, pkg.group(0))
                    asset_path = os.path.join(original_path, 'assets')
                    print "asset path: " + asset_path
                    if os.path.exists(asset_path):         
                        print "copying to: " + default_path
                        # try:
                        shutil.copytree(asset_path, os.path.join(default_path, 'assets'), True)
                        # except:
                            # print 'skipping duplicate dir copy'

                    # write it in the default location like other scripts, but put it in the skin dir too
                    out = codecs.open(os.path.join(default_path, name + filter + type), 'w', 'utf-8')
                    out.truncate(0)
                    out.writelines(result)
                    out.close()
                    out = codecs.open(os.path.join(default_path, name + '-debug.' + type), 'w', 'utf-8')
                    out.truncate(0)
                    out.writelines(result)
                    out.close()
                    out = codecs.open(os.path.join(default_path, name + '.' + type), 'w', 'utf-8')
                    out.truncate(0)
                    out.writelines(result)
                    out.close()

                    # we need the full directory structure to get the relative path to the skin file
                    default_path = os.path.join(default_path, 'assets')
                    if not os.path.exists(default_path):         
                        os.mkdir(default_path)
                    default_path = os.path.join(default_path, 'skins')
                    if not os.path.exists(default_path):         
                        os.mkdir(default_path)
                    default_path = os.path.join(default_path, 'sam')
                    if not os.path.exists(default_path):         
                        os.mkdir(default_path)

                # copy skin assets

                out = codecs.open(os.path.join(default_path, name + filter + type), 'w', 'utf-8')
                out.truncate(0)
                out.writelines(result)
                out.close()

                if len(paths) < 3:
                    out = codecs.open(os.path.join(default_path, name + '-debug.' + type), 'w', 'utf-8')
                    out.truncate(0)
                    out.writelines(result)
                    out.close()
                    out = codecs.open(os.path.join(default_path, name + '.' + type), 'w', 'utf-8')
                    out.truncate(0)
                    out.writelines(result)
                    out.close()

        # for name, mod in src.iteritems():
        #     if 'supersedes' not in mod or ('type' in mod and mod['type'] != 'js'):
        #         continue

        print 'done'

def main():
    threeify = Threeify()

if __name__ == '__main__':
    main()
