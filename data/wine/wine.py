from bs4 import BeautifulSoup
from urllib.request import urlopen
import json
import requests

wineUrls = []
wineCategory = {}
newWine = []
data = []
dd = []
dt = []
goodResponse = True

# Getting the wine categories list
wineList = urlopen("http://www.lcbo.com/content/lcbo/en/catalog/wine.html")
wineListSoup = BeautifulSoup(wineList.read(), 'html.parser')
wineListDiv = wineListSoup.find("div", {"class": "nav"})
wineListDivLi = wineListDiv.findAll("li", {})

# Parsing each wine category link
for wine in wineListDivLi[0:7]:
    wineUrls.append('http://www.lcbo.com' + str(wine.a['href']))

print(wineUrls)

# For loop to swipe between categories
for wine in wineUrls[0:5]:
    i = 0
    j = 0
    wine = wine.replace('/0/list', '')
    wineCategory[j] = []

    # For loop to swipe between pages
    while goodResponse:
        # Cast int to string
        iStr = str(i)
        # Body parameters
        body = {
            'contentBeginIndex': 0,
            'productBeginIndex': iStr,
            'beginIndex': iStr,
            'orderBy': '',
            'pageView': '',
            'resultType': 'products',
            'orderByContent': '',
            'searchTerm': '',
            'facet': '',
            'storeId': 10151,
            'catalogId': 10001,
            'langId': -1,
            'fromPage': '',
            'loginError': '',
            'userId': -1002,
            'objectId': '',
            'requesttype': 'ajax'
        }
        # contains a characteristic string that allows the network protocol peers to identify the application type, operating system, software vendor or software version of the requesting software user agent
        headers = {
            'User-Agent': 'Chrome/50.0.2661.102'
        }

        # Processing request
        try:
            response = requests.get(wine, params=body, headers=headers)
            print(response)

        # Catch Bad response
        except requests.exceptions.RequestException as e:
            # Continue with next category
            j += 1
            print(e)
            goodResponse = False

        print(f"Downaload from page: {response.url}")

        # newWine = urlopen(pageURL).read()
        newWine = response.content

        #  print(newWine)
        wineSoup = BeautifulSoup(newWine, 'html.parser')

        # Getting all the wines of current page
        wineDiv = wineSoup.findAll("div", {"class": "product-image"})

        # Parsing the data of each wine
        for linkToPages in wineDiv:

            # Opening the wine details page
            url_page = "http://www.lcbo.com" + str(linkToPages.a['href'])
            single_page = urlopen(url_page)
            single_soup = BeautifulSoup(single_page.read(), "html.parser")

            # Set name per wine
            wine_name = linkToPages.find('a')['title']
            dt.append("Wine Name")
            dd.append(wine_name)

            # Set price per wine
            wine_price = single_soup.find("span", {"class": "price-value"})
            dt.append("Price")
            dd.append(wine_price.get_text())

            # Getting the last <dl>
            dl_tag = single_soup.find_all('dl')[-1]

            # Parsing the <dt> details (key)
            for dt_tag in dl_tag('dt')[1:]:
                dt.append(dt_tag.get_text())

            # Parsing the <dd> details (value)
            for dd_tag in dl_tag('dd')[1:]:
                if dd_tag.a is not None:
                    dd.append(dd_tag.a.get_text())
                else:
                    dd.append(dd_tag.get_text())

            # Merge 2 lists into one dictionary
            row = dict(zip(dt, dd))

            del dt[:]
            del dd[:]

            wineCategory[j].append(row.copy())
            row.clear()

        # Next page
        i += 12
        with open('data.json', 'w') as fp:
            json.dump(wineCategory, fp)

    # Next category in JSON
    j += 1
    print(wineCategory)

print('DATA1 Wine, Completed.')


