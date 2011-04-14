#!/usr/bin/env python
# -*- coding: utf-8 -*-
# vim: et sw=4 ts=4

# Usage: 3ify.py [yui2 version to wrap] [yui3 module version] [wrapper version number]
# Ex: 3ify.py 2.8.1 3.2.0 4

try:
   import json as simplejson
except:
   import simplejson

import os, codecs, shutil, copy, re, sys

class Threeify(object):

    def __init__(self):
        l = len(sys.argv)

        if l > 1:
            VERSION     = sys.argv[1]
        else:
            VERSION     = '2.9.0'

        if l > 2:
            YUI3_VERSION     = sys.argv[2]
        else:
            YUI3_VERSION     = '3.3.0'

        if l > 3:
            TNT_VERSION     = sys.argv[3]
        else:
            TNT_VERSION     = '4'

        SRC_DIR         = '../meta/'
        SRC_FILE        = VERSION + '_expanded.json'

        # YUI2_DIR        = '../../yui2/build/'
        YUI2_DIR        = '../lib/yui/' + VERSION + '/build/'
        LOCAL_CSS_DIR   = '../lib/yui/localcss/' + VERSION + '/build/'

        TEMPLATE_DIR         = '../template'
        TEMPLATE_FILE        = 'yui3mod.js'
        TEMPLATE_FILE_DOM    = 'yui3mod_dom.js'
        TEMPLATE_FILE_EVENT  = 'yui3mod_event.js'
        TEMPLATE_FILE_YAHOO  = 'yui3mod_yahoo.js'
        TEMPLATE_FILE_ROLLUP = 'yui3mod_rollup.js'
        SUPERSEDED_FILE      = 'superseded.js'

        DEST_DIR        = 'build_tmp.cdn'
        dest_path      = os.path.abspath(DEST_DIR)

        GIT_DIR        = 'build_tmp.local'
        git_path       = os.path.abspath(GIT_DIR)

        if not os.path.exists(dest_path):
            os.mkdir(dest_path)

        if not os.path.exists(git_path):
            os.mkdir(git_path)

        DEST_JSON       = VERSION + '.json'

        build_path       = os.path.join(dest_path, '2in3.' + TNT_VERSION)
        git_build_path   = os.path.join(git_path, '2in3.' + TNT_VERSION)


        if not os.path.exists(build_path):
            os.mkdir(build_path)

        if not os.path.exists(git_build_path):
            os.mkdir(git_build_path)

        build_path       = os.path.join(build_path, VERSION)
        git_build_path   = os.path.join(git_build_path, VERSION)

        if os.path.exists(build_path):
            shutil.rmtree(build_path, True)

        if os.path.exists(git_build_path):
            shutil.rmtree(git_build_path, True)

        os.mkdir(build_path)
        os.mkdir(git_build_path)

        build_path       = os.path.join(build_path, 'build')
        git_build_path   = os.path.join(git_build_path, 'build')

        os.mkdir(build_path)
        os.mkdir(git_build_path)

        TOKENS = {}

        TOKENS['name']       = '{ /* NAME */ }'
        TOKENS['superseded'] = '{ /* SUPERSEDED */ }'
        TOKENS['content']    = '{ /* SOURCE */ }'
        TOKENS['data']       = '{ /* DATA */ }'
        TOKENS['module']     = '{ /* MODULE */ }'
        TOKENS['version']    = '{ /* VERSION */ }'

        src_path        = os.path.abspath(SRC_DIR)
        print src_path

        yui2_path       = os.path.abspath(YUI2_DIR)
        local_css_path  = os.path.abspath(LOCAL_CSS_DIR)

        assets_path     = os.path.join(yui2_path, 'assets')
        assets_dest     = os.path.join(build_path, 'assets')
        git_assets_dest = os.path.join(git_build_path, 'assets')

        template_path   = os.path.abspath(TEMPLATE_DIR)

        print dest_path

        if os.path.exists(assets_path):
            shutil.copytree(assets_path, assets_dest)
            shutil.copytree(assets_path, git_assets_dest)


        # shutil.copytree(yui2_path, build_path)
        # shutil.copytree(yui2_path, git_build_path)

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

        out = codecs.open(os.path.join(git_path, DEST_JSON), 'w', 'utf-8')
        out.writelines(jsonstr)
        out.close()

        template = readFile(template_path, TEMPLATE_FILE)
        template_dom = readFile(template_path, TEMPLATE_FILE_DOM)
        template_event = readFile(template_path, TEMPLATE_FILE_EVENT)
        template_yahoo = readFile(template_path, TEMPLATE_FILE_YAHOO)
        template_rollup = readFile(template_path, TEMPLATE_FILE_ROLLUP)
        superseded = readFile(template_path, SUPERSEDED_FILE)

        template_map = {
            'yui2-dom': template_dom,
            'yui2-event': template_event,
            'yui2-yahoo': template_yahoo,
            'yui2-yuiloader': template_yahoo,
            'yui2-yahoo-dom-event': template_rollup,
            'yui2-utilities': template_rollup,
            'yui2-yuiloader-dom-event': template_rollup,
        }

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

            if not type == 'js':
                try:
                    local_css_content  = readFile(local_css_path, path_min)
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
                        supresult = supresult.replace(TOKENS['module'], name)
                        supresult = supresult.replace(TOKENS['version'], YUI3_VERSION)
                        supresult = supresult.replace(TOKENS['content'], '')
                        supcontent += supresult

                if type == 'js':

                    if name in template_map:
                        result = template_map[name]
                    else:
                        result = template

                    result = result.replace(TOKENS['name'], name)
                    result = result.replace(TOKENS['content'], content)
                    result = result.replace(TOKENS['superseded'], supcontent)
                    result = result.replace(TOKENS['data'], data)
                    result = result.replace(TOKENS['version'], VERSION)
                else:
                    result = content


                # out = codecs.open(os.path.join(build_path, path), 'w', 'utf-8')
                # out.truncate(0)
                # out.writelines(result)
                # out.close()

                # out = codecs.open(os.path.join(git_build_path, path), 'w', 'utf-8')
                # out.truncate(0)
                # out.writelines(result)
                # out.close()

                # default path

                default_path = os.path.join(build_path, name)
                if not os.path.exists(default_path):
                    os.mkdir(default_path)

                git_default_path = os.path.join(git_build_path, name)
                if not os.path.exists(git_default_path):
                    os.mkdir(git_default_path)

                if name.count('skin-') > 0:
                    pkg = re.search('^[^\/]*', path)
                    print "pkg: " + pkg.group(0)
                    original_path = os.path.join(yui2_path, pkg.group(0))
                    asset_path = os.path.join(original_path, 'assets')
                    print "asset path: " + asset_path
                    if os.path.exists(asset_path):
                        print "copying to: " + default_path
                        # try:
                        shutil.copytree(asset_path, os.path.join(default_path, 'assets'), True)
                        shutil.copytree(asset_path, os.path.join(git_default_path, 'assets'), True)
                        # except:
                            # print 'skipping duplicate dir copy'

                    # write it in the default location like other scripts, but put it in the skin dir too
                    out = codecs.open(os.path.join(default_path, name + filter + type), 'w', 'utf-8')
                    out.truncate(0)
                    out.writelines(result)
                    out.close()

                    out = codecs.open(os.path.join(git_default_path, name + filter + type), 'w', 'utf-8')
                    out.truncate(0)
                    out.writelines(result)
                    out.close()

                    out = codecs.open(os.path.join(default_path, name + '-debug.' + type), 'w', 'utf-8')
                    out.truncate(0)
                    out.writelines(result)
                    out.close()

                    out = codecs.open(os.path.join(git_default_path, name + '-debug.' + type), 'w', 'utf-8')
                    out.truncate(0)
                    out.writelines(local_css_content)
                    out.close()

                    out = codecs.open(os.path.join(default_path, name + '.' + type), 'w', 'utf-8')
                    out.truncate(0)
                    out.writelines(local_css_content)
                    out.close()

                    out = codecs.open(os.path.join(git_default_path, name + '.' + type), 'w', 'utf-8')
                    out.truncate(0)
                    out.writelines(local_css_content)
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

                    git_default_path = os.path.join(git_default_path, 'assets')
                    if not os.path.exists(git_default_path):
                        os.mkdir(git_default_path)
                    git_default_path = os.path.join(git_default_path, 'skins')
                    if not os.path.exists(git_default_path):
                        os.mkdir(git_default_path)
                    git_default_path = os.path.join(git_default_path, 'sam')
                    if not os.path.exists(git_default_path):
                        os.mkdir(git_default_path)

                # copy skin assets

                out = codecs.open(os.path.join(default_path, name + filter + type), 'w', 'utf-8')
                out.truncate(0)
                out.writelines(result)
                out.close()

                out = codecs.open(os.path.join(git_default_path, name + filter + type), 'w', 'utf-8')
                out.truncate(0)
                if type == 'js':
                    out.writelines(result)
                else:
                    out.writelines(local_css_content)

                out.close()

                if len(paths) < 3:
                    out = codecs.open(os.path.join(default_path, name + '-debug.' + type), 'w', 'utf-8')
                    out.truncate(0)
                    out.writelines(result)
                    out.close()

                    out = codecs.open(os.path.join(git_default_path, name + '-debug.' + type), 'w', 'utf-8')
                    out.truncate(0)
                    if type == 'js':
                        out.writelines(result)
                    else:
                        out.writelines(local_css_content)
                    out.close()

                    out = codecs.open(os.path.join(default_path, name + '.' + type), 'w', 'utf-8')
                    out.truncate(0)
                    out.writelines(result)
                    out.close()

                    out = codecs.open(os.path.join(git_default_path, name + '.' + type), 'w', 'utf-8')
                    out.truncate(0)
                    if type == 'js':
                        out.writelines(result)
                    else:
                        out.writelines(local_css_content)
                    out.close()

        # for name, mod in src.iteritems():
        #     if 'supersedes' not in mod or ('type' in mod and mod['type'] != 'js'):
        #         continue

        print 'done'

def main():
    threeify = Threeify()

if __name__ == '__main__':
    main()
