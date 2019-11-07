#coding:utf-8
import sys
import io
import base64
from scipy import stats
import numpy as np
import matplotlib.pyplot as plt

if __name__ == '__main__':
    list_str = []
    list1_str = []
    list2_str = []
    list_int = []
    list1_int = []
    list2_int = []

    for i in range(1, len(sys.argv)):
        list_str.append(sys.argv[i].replace(",", ""))

    list_str[0] = list_str[0].replace("[", "")
    list_str[len(sys.argv)-2] = list_str[len(sys.argv)-2].replace("]", "")
    # print("list1Size==", list_str[list_str.__len__()-1])
    # print(type(list_str[list_str.__len__()-1]))
    temp = list_str[list_str.__len__()-1][:-2]
    list1Size=int(temp)

    list1_str=list_str[0:list1Size]

    list2_str=list_str[list1Size:len(list_str)-1]

    list_int=list(map(float, list_str))
    list1_int=list(map(float, list1_str))
    list2_int=list(map(float, list2_str))

    m1 = np.array(list1_int)
    m2 = np.array(list2_int)
    xmin = m1.min()
    xmax = m1.max()
    ymin = m2.min()
    ymax = m2.max()

    X, Y = np.mgrid[xmin:xmax:100j, ymin:ymax:100j]
    positions = np.vstack([X.ravel(), Y.ravel()])
    values = np.vstack([m1, m2])

    kernel = stats.gaussian_kde(values)

    Z = np.reshape(kernel(positions).T, X.shape)

    fig, ax = plt.subplots()
    ax.imshow(np.rot90(Z), cmap=plt.cm.gist_earth_r,
              extent=[xmin, xmax, ymin, ymax])
    ax.plot(m1, m2, 'k.', markersize=2)
    ax.set_xlim([xmin, xmax])
    ax.set_ylim([ymin, ymax])
    # 写入内存
    save_file = io.BytesIO()
    plt.savefig(save_file)
    # 转换base64并以utf8格式输出
    save_file_base64 = base64.b64encode(save_file.getvalue()).decode()
    print(save_file_base64);