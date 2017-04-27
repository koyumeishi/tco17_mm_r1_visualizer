#include <vector>
#include <string>
#include <fstream>

/*
include this file and ...

Initialize
> visualizer::init(n, edges, outputFileName)
  int n : number of vertices
  vector<int> edges : given edge data ( the i-th edge connects vertices edges[3*i] and edges[3*i+1] and has the desired length of edges[3*i+2] )
  string outputFileName : output file name. default value is "vis_output.txt"

Push One Frame
> visualizer::push(pos)
  vector<T> pos : the coordinates of the j-th vertex as (pos[2*j], pos[2*j+1]).

Output
> visualizer::output()
  output all data to the file named outputFileName
*/

namespace visualizer{
  vector<string> res;
  string f;
  void init(int n, vector<int> edges, string outputFileName = "vis_output.txt"){
    f = outputFileName;
    {
      stringstream ss;
      ss << n;
      res.push_back( ss.str() );
    }
    {
      stringstream ss;
      for(int i=0; i<edges.size(); i++){
        ss << edges[i] << (i+1!=edges.size() ? " " : "");
      }
      res.push_back( ss.str() );
    }
  }

  // int or double
  template<class T>
  void push(vector<T> pos){
    stringstream ss;
    for(int i=0; i<pos.size(); i++){
      ss << pos[i] << (i+1 != pos.size() ? " " : "");
    }
    res.push_back( ss.str() );
  }

  void output(){
    ofstream ofs(f);
    for(auto s : res){
      ofs << s << endl;
    }
    ofs.close();
  }
}
