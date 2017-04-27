[TCO17 MM Round1 GraphDrawing](https://community.topcoder.com/longcontest/?module=ViewProblemStatement&compid=55119&rd=16903) のビジュアライザです  
途中の状態も表示できます。  
[https://koyumeishi.github.io/tco17_mm_r1_visualizer/](https://koyumeishi.github.io/tco17_mm_r1_visualizer/)

---

入力ファイルのフォーマット  

```
NV
edges[0] edges[1] ... edges[3*NV-1]
Frame_0
Frame_1
.
.
.
Frame_T
```

NV, edges は問題の入力で与えられているものです。 Frame_i には 時刻 i の点座標を出力してください。 

```
x[0] y[0] x[1] y[1] ... x[NV-1] y[NV-1]
```

---

C++ の方は [visualizer.cpp](https://github.com/koyumeishi/tco17_mm_r1_visualizer/blob/master/visualizer.cpp) を include して、初めに初期化、

```
visualizer::init(NV, edges, filename);
```

出力したい盤面毎に

```
visualizer::push(pos);
```
(pos : vector&lt;int&gt; or vector&lt;double&gt;、 x座標 : pos[2\*i+0]、 y座標 : pos[2\*i+1])  

最後に

```
visualizer::output();
```

で出力されます。 