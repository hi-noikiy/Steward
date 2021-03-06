/**
 * @file help command plugin script
 * @description help
 * @author rong
 */

import _ from 'underscore'
import util from '../../common/util'

const version = 3;
const name = 'help';
const key = 'help';
const type = 'keyword';
const icon = chrome.extension.getURL('img/help.ico');
const title = chrome.i18n.getMessage(`${name}_title`);
const subtitle = chrome.i18n.getMessage(`${name}_subtitle`);
const commands = [{
    key,
    type,
    title,
    subtitle,
    icon,
    shiftKey: true,
    editable: true
}];

// NOTE: Only get the commands when needed, main.js has been immediately obtained
// and then get the object will be empty
function getPlugins(query) {
    const allcommands = window.stewardCache.commands;
    const helpList = _.uniq(_.values(allcommands)).map(command => {
        return {
            icon: command.icon,
            id: command.key,
            name: command.name,
            title: `${command.key}: ${command.title}`,
            desc: `⇧: ${command.subtitle}`,
            type: command.type
        }
    })
    .filter(item => item.type === 'keyword')
    .filter(function (command) {
        return util.matchText(query, `${command.name}${command.title}${command.key}`);
    });

    return _.sortBy(helpList, 'id');
}

function onInput(query) {
    return getPlugins(query);
}

function onEnter(item, command, query, shiftKey) {
    if (shiftKey) {
        chrome.tabs.create({
            url: util.getDocumentURL(item.name)
        });
    } else {
        return Promise.resolve(`${String(item.id.split(',')[0])} `);
    }
}

export default {
    version,
    name: 'Help',
    icon,
    title,
    commands,
    onInput,
    onEnter
};
