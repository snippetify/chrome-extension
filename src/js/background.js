import $ from 'jquery'
import {
    CS_TARGET,
    SNIPPETIFY_URL,
    REFRESH_IFRAME,
    CS_SNIPPETS_COUNT,
    SNIPPETIFY_DOMAIN,
    SNIPPETIFY_API_URL,
    SNIPPETIFY_API_TOKEN,
    SNIPPETIFY_SAVE_USER,
    REVIEW_SELECTED_SNIPPET
} from './contants'

/**
 * Background. App event listeners.
 * @license MIT
 * @author Evens Pierre <pierre.evens16@gmail.com>
*/
class Background {
    constructor () {
        this.onInstalled()
        this.cookieEventListener()
        this.navigationEventListener()
    }

    /**
     * Execute action when extension installed.
     * @returns void
    */
    onInstalled () {
        chrome.runtime.onInstalled.addListener(() => {
            this.createContextMenu()
            this.saveCookieToStorage()
        })
    }

    /**
     * Create context menu on installed.
     * @returns void
    */
    createContextMenu () {
        // Create menu
        chrome.contextMenus.create({
            id: 'snippetifyContextMenu',
            title: 'Save snippet',
            contexts: ['selection']
        })

        // Add listener
        chrome.contextMenus.onClicked.addListener(info => {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                chrome.tabs.connect(tabs[0].id).postMessage({
                    target: CS_TARGET,
                    type: REVIEW_SELECTED_SNIPPET,
                    payload: { title: '', code: info.selectionText, description: '', tags: [], type: 'wiki' }
                })
            })
        })
    }

    /**
     * Save snippetify user token on installed.
     * @returns void
    */
    saveCookieToStorage () {
        chrome.cookies.get({ url: SNIPPETIFY_URL, name: 'token' }, cookie => {
            const value = ((cookie || {}).value || '')
            if (value.length > 1) {
                chrome.storage.local.set({ [SNIPPETIFY_API_TOKEN]: value }, () => {
                    this.authenticateUser(value)
                })
            } else {
                chrome.storage.local.remove(SNIPPETIFY_API_TOKEN, () => {
                    this.logoutUser()
                })
            }
        })
    }

    /**
     * Listen for cookies changed.
     * Save snippetify user token on installed.
     * @returns void
    */
    cookieEventListener () {
        chrome.cookies.onChanged.addListener(e => {
            if ((e.cookie || {}).domain !== SNIPPETIFY_DOMAIN) return
            if (e.removed) {
                chrome.storage.local.remove(SNIPPETIFY_API_TOKEN, () => {
                    this.logoutUser()
                })
            } else {
                chrome.storage.local.set({ [SNIPPETIFY_API_TOKEN]: e.cookie.value }, () => {
                    this.authenticateUser(e.cookie.value)
                })
            }
        })
    }

    /**
     * Listen for page loaded event.
     * Listen for tab changed event.
     * @returns void
    */
    navigationEventListener () {
        // On url changed
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            chrome.browserAction.setBadgeText({ text: '' })
            if (tab.url.includes('snippetify.com')) {
                chrome.browserAction.disable(tabId)
                return
            }
            const port = chrome.tabs.connect(tabId)
            port.postMessage({ target: CS_TARGET, type: CS_SNIPPETS_COUNT })
            port.onMessage.addListener(data => {
                if (data) chrome.browserAction.setBadgeText({ text: `${data.payload || ''}` })
            })
        })

        // Listen for tab changed
        chrome.tabs.onActivated.addListener(info => {
            chrome.tabs.get(info.tabId, tab => {
                chrome.browserAction.setBadgeText({ text: '' })
                if (tab.url.includes('snippetify.com')) {
                    chrome.browserAction.disable(tab.id)
                    return
                }
                const port = chrome.tabs.connect(tab.id)
                port.postMessage({ target: CS_TARGET, type: CS_SNIPPETS_COUNT })
                port.onMessage.addListener(data => {
                    if (data) chrome.browserAction.setBadgeText({ text: `${data.payload || ''}` })
                })
            })
        })
    }

    /**
     * Authenticate user.
     * @returns void
    */
    authenticateUser (token) {
        $.ajax({
            method: 'GET',
            url: `${SNIPPETIFY_API_URL}/users/me`,
            contentType: 'application/json',
            crossDomain: true,
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).done(res => {
            chrome.storage.local.set({ [SNIPPETIFY_SAVE_USER]: res.data })
            this.postMessageToTabs({ target: CS_TARGET, type: REFRESH_IFRAME }) // Refresh iframe
        }).fail((xhr, status) => {
            chrome.storage.local.remove(SNIPPETIFY_SAVE_USER)
        })
    }

    /**
     * Logout user.
     * @returns void
    */
    logoutUser () {
        chrome.storage.local.remove(SNIPPETIFY_API_TOKEN)
        chrome.storage.local.remove(SNIPPETIFY_SAVE_USER)
        this.postMessageToTabs({ target: CS_TARGET, type: REFRESH_IFRAME }) // Refresh iframe
    }

    /**
     * Post message to tabs.
     * @returns void
    */
    postMessageToTabs (payload) {
        chrome.tabs.query({}, tabs => {
            tabs.forEach(tab => {
                chrome.tabs.connect(tab.id).postMessage(payload)
            })
        })
    }
}

// Initialisation
export default new Background()
