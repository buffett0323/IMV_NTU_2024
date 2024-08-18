import numpy as np
import pandas as pd
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline
import plotly.graph_objects as go

def analyze_growth(data, mass_col, oliv_col, kno3_col, degree=2, title='Growth Curve', mass_label='Mass', mass_unit='g', z_start=0, z_end=200, z_step=5):
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Define features and target
    X = df[[oliv_col, kno3_col]]
    y = df[mass_col]
    
    # Polynomial regression model
    polyreg = make_pipeline(PolynomialFeatures(degree), LinearRegression())
    polyreg.fit(X, y)
    
    # Extract coefficients and intercept
    coefficients = polyreg.named_steps['linearregression'].coef_
    intercept = polyreg.named_steps['linearregression'].intercept_
    
    # Construct the equation string
    equation = f"{mass_label} = {intercept:.2f}"
    for i, coef in enumerate(coefficients[1:], start=1):
        equation += f" + ({coef:.2f})*x{i}"
    
    # Prepare 3D plot data
    x_range = np.linspace(df[oliv_col].min(), df[oliv_col].max(), 30)
    y_range = np.linspace(df[kno3_col].min(), df[kno3_col].max(), 30)
    xx, yy = np.meshgrid(x_range, y_range)
    grid_points = pd.DataFrame({oliv_col: xx.ravel(), kno3_col: yy.ravel()})
    zz = polyreg.predict(grid_points).reshape(xx.shape)
    zz[zz < 0] = 0  # Ensure no negative values

    # Create interactive 3D plot with contour lines
    fig = go.Figure(data=[go.Surface(
        z=zz, x=xx, y=yy, colorscale='Viridis',
        contours={"z": {"show": True, "start": z_start, "end": z_end, "size": z_step, "color": "white"}}
    )])
    # fig.add_trace(go.Scatter3d(x=df[oliv_col], y=df[kno3_col], z=df[mass_col], mode='markers', marker=dict(size=5, color='red')))
    fig.add_annotation(text=equation, xref="paper", yref="paper", x=0.5, y=0.95, showarrow=False, font=dict(size=12))
    
    # Update plot layout
    fig.update_layout(
        title=dict(
            text=title,
            x=0.5,
            y=0.95,
            xanchor='center',
            yanchor='top',
            font=dict(size=24)
        ),
        scene=dict(
            xaxis_title=f'{oliv_col} (g)',
            yaxis_title=f'{kno3_col} (g)',
            zaxis=dict(title=f'{mass_label} ({mass_unit})', range=[zz.min(), zz.max()])
        )
    )
    
    # Show plot
    fig.show()
    return coefficients, equation




if __name__ == "__main__":
    
    # Temporarily store the data here
    data1 = {
        'mass_g': [1.16, 0.84, 1.28, 1.17, 0.80, 0.97, 1.26, 1.33, 1.24, 1.74, 1.68, 1.77, 3.94, 3.13, 3.32, 4, 4.7, 5, 5.7, 6.2, 6.7, 7.2, 7.23, 7.23, 7.25, 7.25, 7.26, 7.27, 7.27, 7.26, 7.27 ,7.26, 7.27, 7.27, 7.26, 7.27],
        'OLIV_g': [0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 20, 20, 20, 25, 25, 30, 35, 35, 40, 40, 40, 45, 47, 50, 50, 55, 60, 70, 80, 90, 100, 100, 100, 100],
        'KNO3_g': [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 3, 3.5, 4, 4.3, 4.4 ,4.54, 4.7, 4.8, 5.0, 6, 6, 6.5, 6.5 ,7, 7 ,7, 7.5, 7.5, 8, 8]
    }
    
    data2 = {
        'mass_kg': [1.2, 2, 1.4, 1.5, 2, 2.5, 2.9, 3.4, 3.8, 4.2, 4.5, 4.8, 4.9, 5, 5.2, 2.6, 2.5, 2.8, 3, 3.2, 2.6 ],
        'OLIV_g': [0, 0, 0, 10, 15, 17, 20, 25, 30, 35 ,40, 50 ,70 ,80, 80, 70, 80, 80, 0, 0, 0],
        'KNO3_g': [0, 0, 0, 1, 2, 3, 3.5, 4, 4.3, 4.4 ,4.54, 4.7, 5 ,6, 6, 0, 0, 0, 6, 5, 6]
    }

    data3 = {
        'mass_kg': [3, 2.9, 3, 3.5, 3.7, 4, 4.7, 5, 5.4, 5.9, 6.3, 6.32, 6.37, 6.32, 6.45, 5.6,5.5 ],
        'OLIV_g': [0, 0, 0, 10, 15, 17, 20, 25, 30, 35 ,40, 50 ,70 ,70, 70, 70, 0],
        'KNO3_g': [0, 0, 0, 1, 2, 3, 3.5, 4, 4.3, 4.4 ,4.54, 4.7, 5 ,6, 10, 0,10 ]
    }
    
    tomato_data = {
        'mass_g': [180] * 5 + [190] * 5 + [180] * 5 + [200] * 5 + [150],
        'OLIV_g': [30, 40, 60, 70, 80] + [0] * 5 + [30, 40, 60, 70, 80] + [30, 40, 60, 70, 80] + [0],
        'KNO3_g': [0] * 5 + [3, 4, 6, 7, 8] + [0] * 5 + [3, 4, 6, 7, 8] + [0]
    }
    
    Bok_Choy_data = {
        'mass_g': [
            90, 92, 88, 91, 89, 90, # 初始無添加狀態
            100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 150, 165, # 中等添加OLIV
            155, 163, 168, 171, 160, 176, 170, 172, 173, 175, 169, 165, 173, 168, 168, 171 , 130, 125 # KNO3達到80g以上
        ],
        'OLIV_g': [
            0, 0, 0, 0, 0, 0,
            10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75,
            80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 0, 80
        ],
        'KNO3_g': [
            0, 0, 0, 1, 1, 1,
            2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6,
            7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10, 10, 8, 0
        ]
    }

    potatoes_data = {
        'mass_g': [
            90, 85, 88, 95, 96, 98, # 初始無添加狀態
            102, 110, 110, 115, 127, 128, 130, 135, 140, 145, 150, 155, 150, 165, # 中等添加OLIV
            155, 163, 168, 171, 160, 176, 170, 172, 173, 175, 169, 166, 175, 178, 178, 181 , 130, 135, 128, 125, 118, 126 # KNO3達到80g以上
        ],
        'OLIV_g': [
            0, 0, 0, 0, 0, 0,
            10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75,
            80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 0, 0, 0, 80, 80, 80
        ],
        'KNO3_g': [
            0, 0, 0, 1, 1, 1,
            2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6,
            7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10, 10, 8, 8, 8, 0, 0, 0
        ]
    }
    
    peach_data = {
        'mass_g': [150, 148, 155] + [170] * 5 + [190] * 5 + [200] * 5 + [200] * 5 + [180],
        'OLIV_g': [0] * 3 + [30, 40, 60, 70, 80] + [0] * 5 + [30, 40, 60, 70, 80] + [30, 40, 60, 70, 80] + [0],
        'KNO3_g': [0] * 3 + [0] * 5 + [3, 4, 6, 7, 8] + [0] * 5 + [3, 4, 6, 7, 8] + [0]
    }

    cabbage_data = {
        'mass_kg': [1.5, 1.52, 1.55, 1.6, 1.7, 1.8, 2.0, 2.2, 2.5, 2.8, 3.0, 3.3, 3.4, 3.5, 3.6, 3.6, 3.4, 3.2, 3.0, 3.2, 2, 2.5, 2.2, 2.4, 3.3, 3, 2.8, 2.5, 2.9],
        'OLIV_g': [0, 5, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 100, 100, 100, 100, 100, 100, 100, 20, 60, 40, 50, 100, 0, 0, 0, 50],
        'KNO3_g': [0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 5, 5, 0, 0, 0, 8, 7, 6, 6]
    }

    king_oyster_data = {
        'mass_g': [75, 78, 80, 85, 95, 115, 120, 124, 130, 134, 145, 155, 152, 150, 149, 153, 144, 139, 135, 132, 112, 120, 124, 127, 130, 128, 135, 128, 125, 130],
        'OLIV_g': [0, 5, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 100, 100, 100, 100, 100, 100, 100, 20, 60, 40, 50, 100, 100, 0, 0, 0, 50],
        'KNO3_g': [0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 5, 5, 0, 0, 0, 0, 8, 7, 6, 6]
    }
    

    # Main call
    calls = {
        "空心菜": analyze_growth(data1, 'mass_g', 'OLIV_g', 'KNO3_g', title='空心菜之生長曲面圖', mass_label='重量', mass_unit='克'),
        "高麗菜": analyze_growth(data2, 'mass_kg', 'OLIV_g', 'KNO3_g', title='高麗菜之生長曲面圖', mass_label='植物重', mass_unit='公斤'),
        "花椰菜": analyze_growth(data3, 'mass_kg', 'OLIV_g', 'KNO3_g', title='花椰菜之生長曲面圖', mass_label='植物重', mass_unit='公斤'),
        "大番茄": analyze_growth(tomato_data, 'mass_g', 'OLIV_g', 'KNO3_g', degree=2, title='大番茄生長曲面圖', mass_label='重量', mass_unit='克', z_start=160, z_end=210, z_step=2),
        "蚵仔白": analyze_growth(Bok_Choy_data, 'mass_g', 'OLIV_g', 'KNO3_g', degree=2, title='蚵仔白生長曲面圖', mass_label='重量', mass_unit='克', z_start=80, z_end=180, z_step=5),
        "馬鈴薯": analyze_growth(potatoes_data, 'mass_g', 'OLIV_g', 'KNO3_g', degree=2, title='馬鈴薯生長曲面圖', mass_label='重量', mass_unit='克', z_start=80, z_end=180, z_step=5),
        "水蜜桃": analyze_growth(peach_data, 'mass_g', 'OLIV_g', 'KNO3_g', degree=2, title='水蜜桃生長曲面圖', mass_label='重量', mass_unit='克', z_start=160, z_end=210, z_step=2),
        "天津白菜": analyze_growth(cabbage_data, 'mass_kg', 'OLIV_g', 'KNO3_g', degree=2, title='天津白菜生長曲面圖', mass_label='重量', mass_unit='公斤', z_start=1.5, z_end=3.5, z_step=0.2),
        "杏鮑菇": analyze_growth(king_oyster_data, 'mass_g', 'OLIV_g', 'KNO3_g', degree=2, title='杏鮑菇生長曲面圖', mass_label='重量', mass_unit='克', z_start=100, z_end=150, z_step=10),
    }
    