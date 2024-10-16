import sys
import json
from flask import Flask, request, abort
import os
import numpy as np
import requests
import json
import pandas as pd
import requests
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import base64
import statistics

from linebot import ( # linebot.v3
    LineBotApi, WebhookHandler
)
from linebot.exceptions import (
    InvalidSignatureError
)
from linebot.models import ( # linebot.v3.models
    MessageEvent, TextMessage, TextSendMessage, ImageSendMessage,
    PostbackEvent, MemberJoinedEvent, LocationMessage
)
from bs4 import BeautifulSoup
from prettytable import PrettyTable
import random
import string
import matplotlib as mpl
from matplotlib.font_manager import fontManager
import warnings
warnings.filterwarnings('ignore')



""" 1. Water Spanish """
def water_spanish(fertilizer_amount,olivine_amount):
    fetilizer_amt = float(fertilizer_amount)
    olivine_amt = float(olivine_amount)
    
    url = 'https://www.twfood.cc/topic/vege/%E6%B0%B4%E7%94%9F%E9%A1%9E'  # Replace with the target URL
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Initialize empty lists to store scraped data
    data = []

    # Find each vegetable's information block based on the HTML structure
    vege_blocks = soup.find_all('div', class_='vege_price')

    for block in vege_blocks:
        name = block.find('h4').text.strip()
        prices = block.find_all('span', class_='text-price')
        retail_price = prices[-4].text.strip() if len(prices) > 1 else 'N/A'
        # Append each data as a list to data
        data.append([name, retail_price])

    # Convert data to a pandas DataFrame
    df = pd.DataFrame(data, columns=['品項', '本週平均批發價(元/公斤)'])

    # Optional: Save the DataFrame to a CSV file
    df.to_csv('vege_prices.csv', index=False)

    # Returning the first vegetable's data along with user inputs
    #text = f"The first vegetable is {df['品項'][0]}, with an average wholesale price of {df['本週平均批發價(元/公斤)'][0]} per kilogram. \
    #        You provided fertilizer amount: {fertilizer_amount} and olivine amount: {olivine_amount}."
    
    #return text

      #cost
    ## 農業部的成本表
    seed_cost = 45453
    fertiliser = (fetilizer_amt/20)*290
    wage = 150951
    pesticides = 2652
    machine = 9150
    olivine_price = 20000*olivine_amt/1000
    total_cost = (seed_cost + fertiliser + wage + pesticides + machine + olivine_price)
    total_cost_ex = (seed_cost + fertiliser + wage + pesticides + machine)
    vege_type = df['品項'][1]
    price = float(df['本週平均批發價(元/公斤)'][1]) ##當季好蔬菜
    dry_mass_kgha_fer = 223.0708 + (0.1177986796)*0 + (0.8516414171)*fetilizer_amt + (-0.0000007937)*(0**2) + (-0.0000134670)*0*fetilizer_amt + (-0.0000354190)*(fetilizer_amt**2)
    veg_total_price_ex = price * dry_mass_kgha_fer * 3
    #veg_total_price_ex = 476883
    net_profit_ex = veg_total_price_ex - total_cost_ex
    #profit
    vege_type = df['品項'][1]
    price = float(df['本週平均批發價(元/公斤)'][1]) ##當季好蔬菜
    if olivine_amt ==0:
        coef = 1
    else :
        coef = 1.5
    dry_mass_kgha = 223.0708 + (0.1177986796)*olivine_amt + (0.8516414171)*fetilizer_amt + (-0.0000007937)*(olivine_amt**2) + (-0.0000134670)*olivine_amt*fetilizer_amt + (-0.0000354190)*(fetilizer_amt**2)
    veg_total_price = price * dry_mass_kgha * coef * 3 * 0.75  # (convert dry mass to mass : 5-10倍) # (crop density conversion : 3 from 農業部) ## (1.5是代表dry mass上升2倍但wet mass上升1.5倍)        
    carbon_sequestered = 0.0000028176 + 0.06567886979596845864 * olivine_amt + -0.00000032024927921929 * olivine_amt**2 + 0.00000000000057864824 * olivine_amt**3
    carbon_price = carbon_sequestered/1000 * 65*40*3
    total_profit = veg_total_price + carbon_price
    net_profit = total_profit - total_cost

    # for plotting the graph
    data1 = [total_cost_ex, veg_total_price_ex, 0, net_profit_ex]
    data2 = [total_cost, veg_total_price, carbon_price, net_profit]
    #description = f'原始農法 \n總成本: {data1[0]:.1f} \n農產品價格: {data1[1]:.1f} \n碳價格: {data1[2]:.1f} \n淨收益: {data1[3]:.1f} \n\n固碳農法 \n總成本: {data2[0]:.1f} \n農產品價格: {data2[1]:.1f} \n碳價格: {data2[2]:.1f} \n淨收益: {data2[3]:.1f}\n\n淨收益增長:{data2[3]-data1[3]:.1f}'
    #return description
    net_net = net_profit - net_profit_ex
    #matplotlib.rc('font', family='Microsoft JhengHei')
    x = np.arange(len(data1))  # the label locations
    
    # Define custom colors
    color1 = '#bf794e'
    color2 = '#00a381'

    fontManager.addfont('../calculation/TaipeiSansTCBeta-Regular.ttf')
    mpl.rc('font', family='Taipei Sans TC Beta')
    fig, ax = plt.subplots(figsize=(12, 6))
    plt.bar(x - 0.2, data1, color=color1, width=0.35, align='center', edgecolor='black', label='只有添加肥料')
    plt.bar(x + 0.2, data2, color=color2, width=0.35, align='center', edgecolor='black', label='同時添加肥料及橄欖砂')
    
    plt.xlabel('類別', fontsize=20)
    plt.ylabel('新臺幣', fontsize=24)
    plt.title('原始農法及固碳農法的成本效益比較', fontsize=24)
    plt.xticks(x, ['總共成本', '空心菜平均批發價', '碳權價格', '淨收益'], fontsize=18)
    plt.yticks(fontsize=18)
    plt.legend(fontsize=18)
    #matplotlib.rc('font', family='Microsoft JhengHei')
    # Adding value labels
    for i, v in enumerate(data1):
        plt.text(i - 0.2, v + 5000, f"{v:.1f}", color=color1, ha='center', va='bottom', fontsize=14)
    for i, v in enumerate(data2):
        plt.text(i + 0.2, v + 5000, f"{v:.1f}", color=color2, ha='center', va='bottom', fontsize=14)
    
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    ax.text(0.75, 0.7, f'淨收益增長:{net_net:.1f}', transform=ax.transAxes, fontsize=18, ha='right',color='red')
    
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    
    plot_url = base64.b64encode(img.getvalue()).decode()
    plt.close(fig)
    return plot_url




""" 2. Cabbage """
def cabbage(fertilizer_amount, olivine_amount):
    fetilizer_amt = float(fertilizer_amount)
    olivine_amt = float(olivine_amount)    ## vege type要換  ## crop density ## carbon sequestration統一  ## 3000kg

    url = 'https://www.twfood.cc/topic/vege/%E8%91%89%E8%8F%9C%E9%A1%9E'  # 替換成目標頁面的URL
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    data = []
    # 根據HTML結構尋找每個蔬菜的信息區塊
    vege_blocks = soup.find_all('div', class_='vege_price')

    for block in vege_blocks:
        name = block.find('h4').text.strip()
        prices = block.find_all('span', class_='text-price')
        retail_price = prices[-4].text.strip() if len(prices) > 1 else 'N/A'
        data.append([name, retail_price])

    # 將數據轉換為pandas DataFrame
    df2 = pd.DataFrame(data, columns=['品項', '預估零售價(元/公斤)'])
    df2.to_csv('vege_prices.csv', index=False)

    #cost
    ## 農業部的成本表
    seed_cost = 28554
    fertiliser = (fetilizer_amt)/40*430 ## 39號基肥
    wage = 102328
    pesticides = 67584
    machine = 17552
    olivine_price = 20000*olivine_amt/1000
    total_cost = (seed_cost + fertiliser + wage + pesticides + machine + olivine_price)
    total_cost_ex = (seed_cost + fertiliser + wage + pesticides + machine)
    dry_mass_kgha_fer = 20000 + (3.7111228258)*0 + (0.1075826138)*fetilizer_amt + (-0.0000613036)*0*fetilizer_amt + (0.0002370665)*0**2 + (0.0051245589)*fetilizer_amt**2
    vege_type = df2['品項'][22]
    price = float(df2['預估零售價(元/公斤)'][22]) ##當季好蔬菜
    veg_total_price_ex = price * dry_mass_kgha_fer    # (convert dry mass to mass : 5-10倍) # (crop density conversion : 3 from 農業部) ## (1.5是代表dry mass上升2倍但wet mass上升1.5倍)
    #veg_total_price_ex = 639815
    net_profit_ex = veg_total_price_ex - total_cost_ex
    #profit
    
    vege_type = df2['品項'][22]
    price = float(df2['預估零售價(元/公斤)'][22]) ##當季好蔬菜
    
    
    if olivine_amt ==0:
        coef = 1
        mul = 1
    else :
        coef = 1.5
        mul = 0.7
        # 47930.3124
    dry_mass_kgha = 20000 + (3.7111228258)*olivine_amt + (0.1075826138)*fetilizer_amt + (-0.0000613036)*olivine_amt*fetilizer_amt + (0.0002370665)*olivine_amt**2 + (0.0051245589)*fetilizer_amt**2
    veg_total_price = price * dry_mass_kgha * coef * mul   # (convert dry mass to mass : 5-10倍) # (crop density conversion : 3 from 農業部) ## (1.5是代表dry mass上升2倍但wet mass上升1.5倍)
    carbon_sequestered = 0.0000028176 + 0.06567886979596845864 * olivine_amt + -0.00000032024927921929 * olivine_amt**2 + 0.00000000000057864824 * olivine_amt**3
    carbon_price = carbon_sequestered/1000 * 65*120
    total_profit = veg_total_price + carbon_price
    net_profit = total_profit - total_cost
    # for plotting the graph
    data1 = [total_cost_ex, veg_total_price_ex, 0, net_profit_ex]
    data2 = [total_cost, veg_total_price, carbon_price, net_profit]
    net_net = net_profit - net_profit_ex
    # description = f'原始農法 \n總成本: {round(data1[0], 1)} \n農產品價格: {round(data1[1], 1)} \n碳價格: {round(data1[2], 1)} \n淨收益: {round(data1[3], 1)} \n\n固碳農法 \n總成本: {round(data2[0], 1)} \n農產品價格: {round(data2[1], 1)} \n碳價格: {round(data2[2], 1)} \n淨收益: {round(data2[3], 1)}\n\n淨收益增長:{round(data2[3]-data1[3], 1)}'
    #description = f'原始農法 \n總成本: {data1[0]:.1f} \n農產品價格: {data1[1]:.1f} \n碳價格: {data1[2]:.1f} \n淨收益: {data1[3]:.1f} \n\n固碳農法 \n總成本: {data2[0]:.1f} \n農產品價格: {data2[1]:.1f} \n碳價格: {data2[2]:.1f} \n淨收益: {data2[3]:.1f}\n\n淨收益增長:{data2[3]-data1[3]:.1f}'
    #return description
    #matplotlib.rc('font', family='Microsoft JhengHei')
    x = np.arange(len(data1))  # the label locations
    
    # Define custom colors
    color1 = '#bf794e'
    color2 = '#00a381'
    
    fontManager.addfont('../calculation/TaipeiSansTCBeta-Regular.ttf')
    mpl.rc('font', family='Taipei Sans TC Beta')
    fig, ax = plt.subplots(figsize=(12, 6))
    plt.bar(x - 0.2, data1, color=color1, width=0.35, align='center', edgecolor='black', label='只有添加肥料')
    plt.bar(x + 0.2, data2, color=color2, width=0.35, align='center', edgecolor='black', label='同時添加肥及橄欖砂')
    
    plt.xlabel('類別', fontsize=20)
    plt.ylabel('新臺幣', fontsize=24)
    plt.title('原始農法及固碳農法的成本效益比較', fontsize=24)
    plt.xticks(x, ['總共成本', '高麗菜平均批發價', '碳權價格', '淨收益'], fontsize=18)
    plt.yticks(fontsize=18)
    plt.legend(fontsize=18)
    #matplotlib.rc('font', family='Microsoft JhengHei')
    # Adding value labels
    for i, v in enumerate(data1):
        plt.text(i - 0.2, v + 5000, f"{v:.1f}", color=color1, ha='center', va='bottom', fontsize=14)
    for i, v in enumerate(data2):
        plt.text(i + 0.2, v + 5000, f"{v:.1f}", color=color2, ha='center', va='bottom', fontsize=14)
    
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    ax.text(0.75, 0.7, f'淨收益增長:{net_net:.1f}', transform=ax.transAxes, fontsize=18, ha='right',color='red')

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    
    plot_url = base64.b64encode(img.getvalue()).decode()
    plt.close(fig)
    return plot_url



""" 3. Brocolli """
def brocolli(fertilizer_amount,olivine_amount):
    fetilizer_amt = float(fertilizer_amount)
    olivine_amt = float(olivine_amount)    ## vege type要換  ## crop density ## carbon sequestration統一  ## 3000kg
    url = 'https://www.twfood.cc/topic/vege/%E8%91%89%E8%8F%9C%E9%A1%9E'  # 替換成目標頁面的URL
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    data = []
    # 根據HTML結構尋找每個蔬菜的信息區塊
    vege_blocks = soup.find_all('div', class_='vege_price')

    for block in vege_blocks:
        name = block.find('h4').text.strip()
        prices = block.find_all('span', class_='text-price')
        retail_price = prices[-4].text.strip() if len(prices) > 1 else 'N/A'
        data.append([name, retail_price])

    # 將數據轉換為pandas DataFrame
    df3 = pd.DataFrame(data, columns=['品項', '預估零售價(元/公斤)'])
    df3.to_csv('vege_prices.csv', index=False)
      #cost
    ## 農業部的成本表
    seed_cost = 25254
    fertiliser = (fetilizer_amt)*410/12 ## 黑汪特5號 理應是100kg/分地 1公頃是10.3102分地 所以要下1031公斤
    wage = 111631
    pesticides = 45635
    machine = 16603
    olivine_price = 20000*olivine_amt/1000
    total_cost = (seed_cost + fertiliser + wage + pesticides + machine + olivine_price)
    total_cost_ex = (seed_cost + fertiliser + wage + pesticides + machine)
    dry_mass_kgha_fer = 20800 + (0.9833521087)*0 + (6.3069281943)*fetilizer_amt + (-0.0000055883)*0**2 + (-0.0000800838)*0*fetilizer_amt + (-0.0002548038)*fetilizer_amt**2
    vege_type = df3['品項'][5] ##要換成花椰菜
    price = float(df3['預估零售價(元/公斤)'][5]) ##當季好蔬菜
    veg_total_price_ex = price * dry_mass_kgha_fer
    #veg_total_price_ex = 786233
    net_profit_ex = veg_total_price_ex - total_cost_ex
    #profit

    vege_type = df3['品項'][5] ##要換成花椰菜
    price = float(df3['預估零售價(元/公斤)'][5]) ##當季好蔬菜
    if olivine_amt ==0:
        coef = 1
        mul = 1
    else :
        coef = 1.5
        mul = 0.8
      #29591.1825
    dry_mass_kgha = 20800 + (0.9833521087)*olivine_amt + (6.3069281943)*fetilizer_amt + (-0.0000055883)*olivine_amt**2 + (-0.0000800838)*olivine_amt*fetilizer_amt + (-0.0002548038)*fetilizer_amt**2
    veg_total_price = price * dry_mass_kgha * coef * mul  # (convert dry mass to mass : 5-10倍) # (crop density conversion : 3 from 農業部) ## (1.5是代表dry mass上升2倍但wet mass上升1.5倍)
    carbon_sequestered = 0.0000028176 + 0.06567886979596845864 * olivine_amt + -0.00000032024927921929 * olivine_amt**2 + 0.00000000000057864824 * olivine_amt**3
    carbon_price = carbon_sequestered/1000 *65*120
    total_profit = veg_total_price + carbon_price
    net_profit = total_profit - total_cost
    # for plotting the graph
    data1 = [total_cost_ex, veg_total_price_ex, 0, net_profit_ex]
    data2 = [total_cost, veg_total_price, carbon_price, net_profit]
    net_net = net_profit - net_profit_ex
    #description = f'原始農法 \n總成本: {data1[0]:.1f} \n農產品價格: {data1[1]:.1f} \n碳價格: {data1[2]:.1f} \n淨收益: {data1[3]:.1f} \n\n固碳農法 \n總成本: {data2[0]:.1f} \n農產品價格: {data2[1]:.1f} \n碳價格: {data2[2]:.1f} \n淨收益: {data2[3]:.1f}\n\n淨收益增長:{data2[3]-data1[3]:.1f}'
    #return description

    #matplotlib.rc('font', family='Microsoft JhengHei')
    x = np.arange(len(data1))  # the label locations
    
    # Define custom colors
    color1 = '#bf794e'
    color2 = '#00a381'
    fontManager.addfont('../calculation/TaipeiSansTCBeta-Regular.ttf')
    mpl.rc('font', family='Taipei Sans TC Beta')
    fig, ax = plt.subplots(figsize=(12, 6))
    plt.bar(x - 0.2, data1, color=color1, width=0.35, align='center', edgecolor='black', label='只有添加肥料')
    plt.bar(x + 0.2, data2, color=color2, width=0.35, align='center', edgecolor='black', label='同時添加肥及橄欖砂')
    
    plt.xlabel('類別', fontsize=20)
    plt.ylabel('新臺幣', fontsize=24)
    plt.title('原始農法及固碳農法的成本效益比較', fontsize=24)
    plt.xticks(x, ['總共成本', '花椰菜平均批發價', '碳權價格', '淨收益'], fontsize=18)
    plt.yticks(fontsize=18)
    plt.legend(fontsize=16)

    # Adding value labels
    for i, v in enumerate(data1):
        plt.text(i - 0.2, v + 5000, f"{v:.1f}", color=color1, ha='center', va='bottom', fontsize=14)
    for i, v in enumerate(data2):
        plt.text(i + 0.2, v + 5000, f"{v:.1f}", color=color2, ha='center', va='bottom', fontsize=14)
    
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    ax.text(0.75, 0.7, f'淨收益增長:{net_net:.1f}', transform=ax.transAxes, fontsize=18, ha='right',color='red')
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    
    plot_url = base64.b64encode(img.getvalue()).decode()
    plt.close(fig)
    return plot_url



""" Main Function """
if __name__ == '__main__':
    input_data = json.loads(sys.argv[1])
    crop = input_data['values'][0]
    fertilizer_amount = input_data['values'][1]
    olivine_amount = input_data['values'][2]
    
    if crop == "空心菜":
        result = water_spanish(fertilizer_amount, olivine_amount)
        print(result)
    elif crop == "高麗菜":
        result = cabbage(fertilizer_amount, olivine_amount)
        print(result)
    elif crop == "花椰菜":
        result = brocolli(fertilizer_amount, olivine_amount)
        print(result)
    