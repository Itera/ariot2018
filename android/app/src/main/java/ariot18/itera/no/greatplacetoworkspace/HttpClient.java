package ariot18.itera.no.greatplacetoworkspace;

import android.content.Context;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;

class HttpClient {

    private static HttpClient instance;
    private static Context mCtxt;
    private RequestQueue queue;

    private HttpClient(Context context) {
        mCtxt = context;
        queue = getRequestQueue();
    }

    private RequestQueue getRequestQueue() {
        if (queue == null) {
            queue = Volley.newRequestQueue(mCtxt.getApplicationContext());
        }
        return queue;
    }

    public static synchronized HttpClient getInstance(Context context) {
        if (instance == null) {
            instance = new HttpClient(context);
        }
        return instance;
    }

    <T> void addToRequestQueue(Request<T> req) {
        getRequestQueue().add(req);
    }
}
