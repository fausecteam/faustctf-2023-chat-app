#!/usr/bin/env python3

import requests
from ctf_gameserver import checkerlib
import helpers
import secrets
import logging
import time

import utils

PORT = 3000

class TemplateChecker(checkerlib.BaseChecker):

    def __init__(self, ip, team):
        checkerlib.BaseChecker.__init__(self, ip, team)
        self._baseurl = f'http://[{self.ip}]:{PORT}'

    def place_flag(self, tick):
        
        res = requests.get(self._baseurl)
        if res.status_code != 200:
            return checkerlib.CheckResult.DOWN

        # get data
        username = helpers.randomUser()
        guest = helpers.randomUser()
        password = secrets.token_hex()
        flag = checkerlib.get_flag(tick)

        # print data for debugging
        logging.info(f'username: {username}')
        logging.info(f'password: {password}')
        logging.info(f'guest: {guest}')
        logging.info(f'flag: {flag}')

        # place flag
        status, data = helpers.register(self._baseurl, guest, password)
        if  status == False:
            logging.info(data)
            return checkerlib.CheckResult.FAULTY
        
        status, token = helpers.register(self._baseurl, username, password)
        if status == False:
            logging.info(token)
            return checkerlib.CheckResult.FAULTY
        
        # TEST TEST Check if login is working
        status, chats = helpers.get_chats(self._baseurl, token)
        if status == False:
            logging.info(chats)
            return checkerlib.CheckResult.FAULTY
        
        status, chat_id = helpers.create_chat(self._baseurl, token, guest)
        if status == False:
            logging.info(chat_id)
            return checkerlib.CheckResult.FAULTY
        
        status, data = helpers.post_message(self._baseurl, token, chat_id, f'Hey {guest}!')
        if  status == False:
            logging.info(data)
            return checkerlib.CheckResult.FAULTY
        
        status, data = helpers.post_message(self._baseurl, token, chat_id, f'here is the secret: {flag}')
        if  status == False:
            logging.info(data)
            return checkerlib.CheckResult.FAULTY

        # store data
        checkerlib.set_flagid(username)
        checkerlib.store_state(f'username_{tick}', username)
        checkerlib.store_state(f'password_{tick}', password)
        checkerlib.store_state(f'chat_{tick}', chat_id)

        return checkerlib.CheckResult.OK

    def check_service(self):

        res = requests.get(self._baseurl)
        if res.status_code != 200:
            return checkerlib.CheckResult.DOWN
        
        username = helpers.randomUser()
        guest = helpers.randomUser()
        password = secrets.token_hex()
        gpassword = secrets.token_hex()
        secret = helpers.randomUser()


        status, token = helpers.register(self._baseurl, username, password)
        if status == False:
            logging.info(token)
            return checkerlib.CheckResult.FAULTY
        
        
        status, gtoken = helpers.register(self._baseurl, guest, gpassword)
        if status == False:
            logging.info(gtoken)
            return checkerlib.CheckResult.FAULTY
        
        
        status, chat_id = helpers.create_chat(self._baseurl, token, guest)
        if status == False:
            logging.info(chat_id)
            return checkerlib.CheckResult.FAULTY
        
        status, data = helpers.post_message(self._baseurl, token, chat_id, secret)
        if  status == False:
            logging.info(data)
            return checkerlib.CheckResult.FAULTY
        
        status, gtoken = helpers.login(self._baseurl, guest, gpassword)
        if status == False:
            logging.info(gtoken)
            return checkerlib.CheckResult.FAULTY

        status, chats = helpers.get_chats(self._baseurl, gtoken)
        if status == False:
            logging.info(chats)
            return checkerlib.CheckResult.FAULTY
        
        for chat in chats:
            chat_id = chat['id']
            status, messages = helpers.get_messages(self._baseurl, gtoken, chat_id)
            
            if status == False:
                logging.info(messages)
                return checkerlib.CheckResult.FAULTY
            
            for message in messages:
                if message['content'] != secret:
                    return checkerlib.CheckResult.FAULTY

        return checkerlib.CheckResult.OK

    def check_flag(self, tick):

        res = requests.get(self._baseurl)
        if res.status_code != 200:
            return checkerlib.CheckResult.DOWN

        username = checkerlib.load_state(f'username_{tick}')
        password = checkerlib.load_state(f'password_{tick}')
        chat_id = checkerlib.load_state(f'chat_{tick}')
        flag = checkerlib.get_flag(tick)

        if not username or not password:
            # TODO Is this really faulty?
            return checkerlib.CheckResult.FLAG_NOT_FOUND

        logging.info(f"Check flag for {username} with pw {password}")
        
        status, token = helpers.login(self._baseurl, username, password)
        if status == False:
            logging.info(token)
            # This is flag not found because the user does not exist
            return checkerlib.CheckResult.FLAG_NOT_FOUND
        
        status, messages = helpers.get_messages(self._baseurl, token, chat_id)            
        if status == False:
            logging.info(messages)
            return checkerlib.CheckResult.FAULTY
        
        for message in messages:
            if message['content'] == f'here is the secret: {flag}':
                return checkerlib.CheckResult.OK

        return checkerlib.CheckResult.FLAG_NOT_FOUND


if __name__ == '__main__':

    checkerlib.run_check(TemplateChecker)
