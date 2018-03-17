package ariot18.itera.no.greatplacetoworkspace;

import android.content.Context;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.RequestFuture;
import com.android.volley.toolbox.Volley;

import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

class SanityClient {

    private final String API_KEY = BuildConfig.SANITY_API_KEY;
    private final String SANITY_API_BASE = "https://k06fkcmv.api.sanity.io/v1/data/";

    private static SanityClient instance;
    private static Context mCtxt;
    private RequestQueue queue;

    private SanityClient(Context context) {
        mCtxt = context;
        queue = getRequestQueue();
    }

    private RequestQueue getRequestQueue() {
        if (queue == null) {
            queue = Volley.newRequestQueue(mCtxt.getApplicationContext());
        }
        return queue;
    }

    public static synchronized SanityClient getInstance(Context context) {
        if (instance == null) {
            instance = new SanityClient(context);
        }
        return instance;
    }

    private <T> void addToRequestQueue(Request<T> req) {
        getRequestQueue().add(req);
    }

    public JSONObject getPerson(String cardId) {
        RequestFuture<JSONObject> future = RequestFuture.newFuture();
        String url = null;
        try {
            url = URLEncoder.encode(SANITY_API_BASE + "query/production/?query=*[id == '" + cardId + "']", "utf8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        System.out.println(url);
        JsonObjectRequest request = new JsonObjectRequest(
                Request.Method.GET,
                url,
                null,
                future,
                future
        ) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<>();
                headers.put("Content-Type", "application/json; charset=UTF-8");
                headers.put("Authorization", "Bearer " + API_KEY);
                return headers;
            }
        };
        addToRequestQueue(request);
        try {
            return future.get();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
        return null;
    }

}
